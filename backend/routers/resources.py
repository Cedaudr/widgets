from fastapi import APIRouter, HTTPException, Query

from config import settings
from database import get_db
from models.schemas import (
    Agent,
    Article,
    Client,
    Feedback,
    Integration,
    ItemsResponse,
    Notification,
    NotificationReadUpdate,
    SalesReport,
    SettingsResponse,
    SettingsUpdate,
    Team,
    Weather,
)
from utils import strip_id

router = APIRouter(prefix=settings.api_prefix, tags=["resources"])


async def _all(collection: str, model, **filters):
    documents = await get_db()[collection].find(filters).to_list(length=None)
    items = [model.model_validate(strip_id(doc)) for doc in documents]
    return ItemsResponse(items=items, total=len(items))


@router.get("/clients", response_model=ItemsResponse[Client], summary="List clients")
async def list_clients() -> ItemsResponse[Client]:
    return await _all("clients", Client)


@router.get("/agents", response_model=ItemsResponse[Agent], summary="List agents")
async def list_agents() -> ItemsResponse[Agent]:
    return await _all("agents", Agent)


@router.get("/teams", response_model=ItemsResponse[Team], summary="List teams")
async def list_teams() -> ItemsResponse[Team]:
    return await _all("teams", Team)


@router.get("/articles", response_model=ItemsResponse[Article], summary="List knowledge base articles")
async def list_articles(status: str | None = Query(default=None, pattern="^(published|draft)$")) -> ItemsResponse[Article]:
    return await _all("articles", Article, **({"status": status} if status else {}))


@router.get("/feedback", response_model=ItemsResponse[Feedback], summary="List customer feedback")
async def list_feedback() -> ItemsResponse[Feedback]:
    return await _all("feedback", Feedback)


@router.get("/integrations", response_model=ItemsResponse[Integration], summary="List integrations")
async def list_integrations() -> ItemsResponse[Integration]:
    return await _all("integrations", Integration)


@router.get("/notifications", response_model=ItemsResponse[Notification], summary="List notifications")
async def list_notifications() -> ItemsResponse[Notification]:
    items = await _all("notifications", Notification)
    items.items.sort(key=lambda notification: notification.created_at, reverse=True)
    return items


@router.patch("/notifications/{notification_id}/read", response_model=Notification, summary="Mark a notification read or unread")
async def set_notification_read(notification_id: int, payload: NotificationReadUpdate) -> Notification:
    document = await get_db()["notifications"].find_one_and_update(
        {"id": notification_id},
        {"$set": {"read": payload.read}},
        return_document=True,
    )
    if document is None:
        raise HTTPException(status_code=404, detail=f"Notification {notification_id} not found")
    return Notification.model_validate(strip_id(document))


@router.get("/settings", response_model=SettingsResponse, summary="Get dashboard settings")
async def get_settings() -> SettingsResponse:
    document = await get_db()["settings"].find_one()
    if document is None:
        raise HTTPException(status_code=404, detail="Settings not found")
    return SettingsResponse.model_validate(strip_id(document))


@router.patch("/settings", response_model=SettingsResponse, summary="Update dashboard settings")
async def update_settings(payload: SettingsUpdate) -> SettingsResponse:
    changes = payload.model_dump(exclude_unset=True, by_alias=True, mode="json")
    if not changes:
        raise HTTPException(status_code=400, detail="No fields to update")

    document = await get_db()["settings"].find_one_and_update(
        {},
        {"$set": changes},
        return_document=True,
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Settings not found")
    return SettingsResponse.model_validate(strip_id(document))


@router.get("/weather", response_model=Weather, summary="Get the weather widget data")
async def get_weather(
    location: str = Query(default="Palo Alto", description="Location to look up"),
) -> Weather:
    document = await get_db()["weather"].find_one({"location": location})
    if document is None:
        raise HTTPException(status_code=404, detail=f"Weather for '{location}' not found")
    return Weather.model_validate(strip_id(document))


@router.get("/sales/report", response_model=SalesReport, summary="Get the sales report data")
async def get_sales_report() -> SalesReport:
    document = await get_db()["sales_reports"].find_one()
    if document is None:
        raise HTTPException(status_code=404, detail="Sales report not found")
    return SalesReport.model_validate(strip_id(document))
