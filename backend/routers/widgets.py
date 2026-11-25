from typing import Any

from fastapi import APIRouter, HTTPException

from config import settings
from database import get_db
from models.schemas import ItemsResponse, WidgetDetail, WidgetSummary
from utils import strip_id

router = APIRouter(prefix=f"{settings.api_prefix}/widgets", tags=["widgets"])


@router.get("", response_model=ItemsResponse[WidgetSummary], summary="Widget catalog")
async def list_widgets() -> ItemsResponse[WidgetSummary]:
    documents = await get_db()["widgets"].find().to_list(length=None)
    items = [WidgetSummary.model_validate(strip_id(doc)) for doc in documents]
    return ItemsResponse(items=items, total=len(items))


@router.get("/{slug}", response_model=WidgetDetail, summary="Get a widget definition")
async def get_widget(slug: str) -> WidgetDetail:
    document = await get_db()["widgets"].find_one({"slug": slug})
    if document is None:
        raise HTTPException(status_code=404, detail=f"Widget '{slug}' not found")
    return WidgetDetail.model_validate(strip_id(document))


@router.get("/{slug}/config", response_model=dict[str, Any], summary="Get a widget's config payload")
async def get_widget_config(slug: str) -> dict[str, Any]:
    document = await get_db()["widgets"].find_one({"slug": slug}, {"config": 1})
    if document is None or "config" not in document:
        raise HTTPException(status_code=404, detail=f"Config for widget '{slug}' not found")
    return strip_id(document)["config"]
