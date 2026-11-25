from fastapi import APIRouter, HTTPException, Query, Response, status

from config import settings
from database import get_db
from models.schemas import (
    Activity,
    ActivityCreate,
    ActivityTab,
    ItemsResponse,
)
from utils import strip_id

router = APIRouter(prefix=f"{settings.api_prefix}/activities", tags=["activities"])

_ICON_BY_TYPE = {
    "ticket_updated": ("Ticket", "text-blue-500"),
    "client_added": ("UserCheck", "text-emerald-500"),
    "agent_reassigned": ("Repeat2", "text-violet-500"),
    "sla_breach_risk": ("TriangleAlert", "text-red-500"),
    "knowledge_base": ("BookOpen", "text-teal-500"),
    "customer_feedback": ("Star", "text-amber-500"),
}


@router.get("/tabs", response_model=list[ActivityTab], summary="Available activity tabs")
async def get_tabs() -> list[ActivityTab]:
    return list(ActivityTab)


@router.get("", response_model=ItemsResponse[Activity], summary="List and search activities")
async def list_activities(
    tab: ActivityTab | None = None,
    q: str | None = Query(default=None, description="Filter by activity title"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
) -> ItemsResponse[Activity]:
    query: dict = {}
    if tab is not None:
        query["tab"] = tab.value

    documents = await get_db()["activities"].find(query).to_list(length=None)
    needle = (q or "").lower()
    filtered = [
        strip_id(doc)
        for doc in documents
        if not needle or needle in doc.get("title", "").lower()
    ]
    filtered.sort(key=lambda activity: activity.get("id", 0), reverse=True)
    page = filtered[skip : skip + limit]
    return ItemsResponse(
        items=[Activity.model_validate(doc) for doc in page],
        total=len(filtered),
    )


@router.post("", response_model=Activity, status_code=status.HTTP_201_CREATED, summary="Create an activity")
async def create_activity(payload: ActivityCreate) -> Activity:
    counter = await get_db()["counters"].find_one_and_update(
        {"_id": "activity"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    icon, tone = _ICON_BY_TYPE.get(payload.type, ("Activity", "text-blue-500"))
    document = {
        "id": counter["seq"],
        **payload.model_dump(by_alias=True, mode="json"),
        "icon": payload.icon or icon,
        "tone": payload.tone or tone,
    }
    await get_db()["activities"].insert_one(document)
    return Activity.model_validate(strip_id(document))


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an activity")
async def delete_activity(activity_id: int) -> Response:
    result = await get_db()["activities"].delete_one({"id": activity_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Activity {activity_id} not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
