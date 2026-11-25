from fastapi import APIRouter, HTTPException

from config import settings
from database import get_db
from models.schemas import CurrentUser, ItemsResponse, UserUpdate
from utils import strip_id

router = APIRouter(prefix=f"{settings.api_prefix}/users", tags=["users"])

CURRENT_USER_EMAIL = "samanwalker@gmail.com"


@router.get("/me", response_model=CurrentUser, summary="Get the signed-in user")
async def get_current_user() -> CurrentUser:
    document = await get_db()["users"].find_one({"email": CURRENT_USER_EMAIL})
    if document is None:
        raise HTTPException(status_code=404, detail="Current user not found")
    return CurrentUser.model_validate(strip_id(document))


@router.patch("/me", response_model=CurrentUser, summary="Update the signed-in user")
async def update_current_user(payload: UserUpdate) -> CurrentUser:
    changes = payload.model_dump(exclude_unset=True, by_alias=True, mode="json")
    if not changes:
        raise HTTPException(status_code=400, detail="No fields to update")

    document = await get_db()["users"].find_one_and_update(
        {"email": CURRENT_USER_EMAIL},
        {"$set": changes},
        return_document=True,
    )
    if document is None:
        raise HTTPException(status_code=404, detail="Current user not found")
    return CurrentUser.model_validate(strip_id(document))


@router.get("", response_model=ItemsResponse[CurrentUser], summary="List users")
async def list_users() -> ItemsResponse[CurrentUser]:
    documents = await get_db()["users"].find().to_list(length=None)
    items = [CurrentUser.model_validate(strip_id(doc)) for doc in documents]
    return ItemsResponse(items=items, total=len(items))
