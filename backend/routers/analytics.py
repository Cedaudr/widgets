from datetime import date, timedelta

from fastapi import APIRouter, HTTPException, Query

from config import settings
from database import get_db
from models.schemas import (
    CsatNps,
    ItemsResponse,
    Kpi,
    KpiSummary,
    Range,
    SlaCompliance,
    TicketVolume,
    Workload,
)
from utils import strip_id

router = APIRouter(prefix=f"{settings.api_prefix}/analytics", tags=["analytics"])


def _week_labels(range_: Range) -> tuple[list[str], int | None]:
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    start = monday if range_ == Range.ThisWeek else monday - timedelta(days=7)
    days = [(start + timedelta(days=index)).strftime("%a %d %b") for index in range(7)]
    highlight = (today - start).days if range_ == Range.ThisWeek else None
    return days, highlight


def _month_start(range_: Range) -> date:
    this_month = date.today().replace(day=1)
    if range_ == Range.LastMonth:
        return (this_month - timedelta(days=1)).replace(day=1)
    return this_month


def _month_labels(range_: Range) -> list[str]:
    first = _month_start(range_)
    next_month = (first.replace(day=28) + timedelta(days=4)).replace(day=1)
    last_day = (next_month - timedelta(days=1)).day
    chunk = last_day // 4
    starts = [1, chunk + 1, chunk * 2 + 1, chunk * 3 + 1]
    ends = [chunk, chunk * 2, chunk * 3, last_day]
    return [f"{start}–{end} {first.strftime('%b')}" for start, end in zip(starts, ends)]


async def _kpis(range_: Range) -> list[Kpi]:
    documents = await get_db()["kpis"].find({"range": range_.value}).to_list(length=None)
    return [Kpi.model_validate(strip_id(doc)) for doc in documents]


async def _volume(range_: Range) -> TicketVolume:
    document = await get_db()["ticket_volume"].find_one({"range": range_.value})
    if document is None:
        raise HTTPException(status_code=404, detail=f"No ticket volume for {range_.value}")

    data = strip_id(document)
    if range_ in (Range.LastWeek, Range.ThisWeek):
        data["days"], highlight = _week_labels(range_)
    else:
        data["days"] = _month_labels(range_)
        highlight = None
    data["highlightIndex"] = highlight
    days = data["days"]
    bars = data.get("bars", [])
    data["series"] = [
        {"day": days[i] if i < len(days) else "", "value": value}
        for i, value in enumerate(bars)
    ]
    return TicketVolume.model_validate(data)


@router.get("/kpis", response_model=ItemsResponse[Kpi], summary="KPI cards for a date range")
async def get_kpis(range_: Range = Query(default=Range.ThisWeek, alias="range")) -> ItemsResponse[Kpi]:
    items = await _kpis(range_)
    return ItemsResponse(items=items, total=len(items))


@router.get("/ticket-volume", response_model=TicketVolume, summary="Ticket volume chart data")
async def get_ticket_volume(range_: Range = Query(default=Range.ThisWeek, alias="range")) -> TicketVolume:
    return await _volume(range_)


@router.get("/summary", response_model=KpiSummary, summary="All dashboard analytics in one call")
async def get_summary(range_: Range = Query(default=Range.ThisWeek, alias="range")) -> KpiSummary:
    return KpiSummary(range=range_, kpis=await _kpis(range_), volume=await _volume(range_))


@router.get("/sla-compliance", response_model=SlaCompliance, summary="SLA compliance metrics")
async def get_sla_compliance() -> SlaCompliance:
    document = await get_db()["analytics_sla"].find_one()
    if document is None:
        raise HTTPException(status_code=404, detail="SLA compliance data not found")
    return SlaCompliance.model_validate(strip_id(document))


@router.get("/csat-nps", response_model=CsatNps, summary="CSAT and NPS metrics")
async def get_csat_nps() -> CsatNps:
    document = await get_db()["analytics_csat"].find_one()
    if document is None:
        raise HTTPException(status_code=404, detail="CSAT/NPS data not found")
    return CsatNps.model_validate(strip_id(document))


@router.get("/workload", response_model=Workload, summary="Agent workload metrics")
async def get_workload() -> Workload:
    document = await get_db()["analytics_workload"].find_one()
    if document is None:
        raise HTTPException(status_code=404, detail="Workload data not found")
    return Workload.model_validate(strip_id(document))
