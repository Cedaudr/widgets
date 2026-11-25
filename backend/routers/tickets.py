from fastapi import APIRouter, HTTPException, Query, Response, status

from config import settings
from database import get_db
from models.schemas import (
    ItemsResponse,
    Priority,
    Ticket,
    TicketCreate,
    TicketSort,
    TicketStatus,
    TicketUpdate,
)
from utils import strip_id

router = APIRouter(prefix=f"{settings.api_prefix}/tickets", tags=["tickets"])

_PRIORITY_RANK = {"High": 3, "Medium": 2, "Low": 1}

_SORT_KEYS = {
    TicketSort.id: lambda ticket: ticket.get("id", 0),
    TicketSort.subject: lambda ticket: ticket.get("subject", "").lower(),
    TicketSort.priority: lambda ticket: _PRIORITY_RANK.get(ticket.get("priority"), 0),
    TicketSort.agent: lambda ticket: ticket.get("agent", "").lower(),
    TicketSort.status: lambda ticket: ticket.get("status", "").lower(),
    TicketSort.created: lambda ticket: str(ticket.get("created", "")),
    TicketSort.due: lambda ticket: ticket.get("dueH", 0),
}


def _matches(ticket: dict, query: str, priority: Priority | None, status_: TicketStatus | None) -> bool:
    if priority is not None and ticket.get("priority") != priority.value:
        return False
    if status_ is not None and ticket.get("status") != status_.value:
        return False
    if not query:
        return True

    needle = query.lstrip("#").lower()
    return (
        needle in str(ticket.get("id", ""))
        or needle in ticket.get("subject", "").lower()
        or needle in ticket.get("agent", "").lower()
    )


@router.get("", response_model=ItemsResponse[Ticket], summary="List and filter tickets")
async def list_tickets(
    q: str | None = Query(default=None, description="Search by ticket ID or subject; a leading # is ignored"),
    priority: Priority | None = None,
    status_: TicketStatus | None = Query(default=None, alias="status"),
    sort_by: TicketSort = TicketSort.id,
    dir: int = Query(default=1, ge=-1, le=1, description="1 = ascending, -1 = descending"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=500),
) -> ItemsResponse[Ticket]:
    documents = await get_db()["tickets"].find().to_list(length=None)
    filtered = [
        strip_id(doc)
        for doc in documents
        if _matches(doc, q or "", priority, status_)
    ]
    filtered.sort(key=_SORT_KEYS[sort_by], reverse=dir < 0)
    page = filtered[skip : skip + limit]
    return ItemsResponse(
        items=[Ticket.model_validate(doc) for doc in page],
        total=len(filtered),
    )


@router.get("/sla/breach-risk", response_model=ItemsResponse[Ticket], summary="Tickets at risk of SLA breach")
async def get_breach_risk() -> ItemsResponse[Ticket]:
    documents = await get_db()["tickets"].find({"dueH": {"$lte": 2}}).to_list(length=None)
    items = [Ticket.model_validate(strip_id(doc)) for doc in documents]
    return ItemsResponse(items=items, total=len(items))


@router.get("/{ticket_id}", response_model=Ticket, summary="Get one ticket")
async def get_ticket(ticket_id: int) -> Ticket:
    document = await get_db()["tickets"].find_one({"id": ticket_id})
    if document is None:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return Ticket.model_validate(strip_id(document))


@router.post("", response_model=Ticket, status_code=status.HTTP_201_CREATED, summary="Create a ticket")
async def create_ticket(payload: TicketCreate) -> Ticket:
    counter = await get_db()["counters"].find_one_and_update(
        {"_id": "ticket"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    document = {"id": counter["seq"], **payload.model_dump(by_alias=True, mode="json")}
    await get_db()["tickets"].insert_one(document)
    return Ticket.model_validate(strip_id(document))


@router.patch("/{ticket_id}", response_model=Ticket, summary="Update a ticket")
async def update_ticket(ticket_id: int, payload: TicketUpdate) -> Ticket:
    changes = payload.model_dump(exclude_unset=True, by_alias=True, mode="json")
    if not changes:
        raise HTTPException(status_code=400, detail="No fields to update")

    document = await get_db()["tickets"].find_one_and_update(
        {"id": ticket_id},
        {"$set": changes},
        return_document=True,
    )
    if document is None:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return Ticket.model_validate(strip_id(document))


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a ticket")
async def delete_ticket(ticket_id: int) -> Response:
    result = await get_db()["tickets"].delete_one({"id": ticket_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
