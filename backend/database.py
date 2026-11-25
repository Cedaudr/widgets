from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from config import settings

_client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    global _client
    _client = AsyncIOMotorClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_timeout_ms,
    )
    await _client.admin.command("ping")
    await _create_indexes(get_db())


async def close_mongo() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


def get_db() -> AsyncIOMotorDatabase:
    if _client is None:
        raise RuntimeError("MongoDB client is not connected")
    return _client[settings.mongodb_db]


async def _create_indexes(db: AsyncIOMotorDatabase) -> None:
    await db["tickets"].create_index("id", unique=True)
    await db["widgets"].create_index("slug", unique=True)
    await db["kpis"].create_index([("range", 1), ("label", 1)], unique=True)
    await db["ticket_volume"].create_index("range", unique=True)
    await db["activities"].create_index("tab")
    await db["users"].create_index("email", unique=True)
