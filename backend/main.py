from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import close_mongo, connect_to_mongo, get_db
from models.schemas import HealthResponse
from routers import activities, analytics, resources, tickets, users, widgets
from seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    if settings.seed_on_startup:
        await seed_database(get_db())
    yield
    await close_mongo()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend for the Kravio support dashboard and widget gallery. "
        "All data is persisted in MongoDB. Swagger UI is available at /docs."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (analytics.router, tickets.router, activities.router, users.router, widgets.router, resources.router):
    app.include_router(router)


@app.get("/", tags=["meta"], summary="API information")
async def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "openapi": "/openapi.json",
        "api": settings.api_prefix,
    }


@app.get("/health", response_model=HealthResponse, tags=["meta"], summary="Check API and MongoDB status")
async def health() -> HealthResponse:
    await get_db().client.admin.command("ping")
    return HealthResponse(status="ok", database=settings.mongodb_db, version=settings.app_version)
