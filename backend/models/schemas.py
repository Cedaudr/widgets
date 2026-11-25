from datetime import date, datetime
from enum import Enum
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class APIModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class ItemsResponse(APIModel, Generic[T]):
    items: list[T]
    total: int


class Priority(str, Enum):
    High = "High"
    Medium = "Medium"
    Low = "Low"


class TicketStatus(str, Enum):
    InReview = "In Review"
    Delivered = "Delivered"
    InProgress = "In Progress"


class Range(str, Enum):
    LastWeek = "Last week"
    ThisWeek = "This week"
    LastMonth = "Last month"
    ThisMonth = "This month"


class ActivityTab(str, Enum):
    Today = "Today"
    Yesterday = "Yesterday"
    ThisWeek = "This week"


class TicketSort(str, Enum):
    id = "id"
    subject = "subject"
    priority = "priority"
    agent = "agent"
    status = "status"
    created = "created"
    due = "due"


class Kpi(APIModel):
    label: str
    icon: str
    value: str
    delta: float | int
    data: list[int | float]


class TicketVolume(APIModel):
    range: Range
    total: str
    total_delta: float | int = Field(alias="totalDelta")
    days: list[str]
    axis: list[int]
    bars: list[int]
    series: list[dict[str, Any]]
    highlight_index: int | None = Field(default=None, alias="highlightIndex")


class KpiSummary(APIModel):
    range: Range
    kpis: list[Kpi]
    volume: TicketVolume


class TicketBase(APIModel):
    subject: str
    priority: Priority
    agent: str
    status: TicketStatus
    created: date
    due: str
    due_h: int = Field(alias="dueH")


class TicketCreate(TicketBase):
    pass


class TicketUpdate(APIModel):
    subject: str | None = None
    priority: Priority | None = None
    agent: str | None = None
    status: TicketStatus | None = None
    created: date | None = None
    due: str | None = None
    due_h: int | None = Field(default=None, alias="dueH")


class Ticket(TicketBase):
    id: int


class Activity(APIModel):
    id: int
    type: str
    tab: ActivityTab
    icon: str
    tone: str
    title: str
    time: str
    body: str
    body_text: str = Field(alias="bodyText")


class ActivityCreate(APIModel):
    type: str
    tab: ActivityTab
    title: str
    time: str
    body: str
    body_text: str = Field(alias="bodyText")
    icon: str | None = None
    tone: str | None = None


class CurrentUser(APIModel):
    name: str
    email: str
    avatar_initials: str = Field(alias="avatarInitials")
    online: bool
    theme: str
    role: str


class UserUpdate(APIModel):
    name: str | None = None
    theme: str | None = None
    online: bool | None = None


class WidgetSummary(APIModel):
    slug: str
    eyebrow: str
    title: str
    description: str
    path: str
    icon: str


class WidgetDetail(WidgetSummary):
    config: dict[str, Any]


class ForecastSlot(APIModel):
    time: str
    temp: int


class Weather(APIModel):
    location: str
    icon: str
    forecast: list[ForecastSlot]


class SalesStat(APIModel):
    value: int
    change: str
    secondary: str


class SalesRegion(APIModel):
    name: str
    value: str


class SalesReport(APIModel):
    title: str
    summary_label: str = Field(alias="summaryLabel")
    summary: int
    currency: str
    monthly: SalesStat
    yearly: SalesStat
    regions: list[SalesRegion]


class Client(APIModel):
    name: str
    industry: str
    status: str


class Agent(APIModel):
    name: str
    team: str
    role: str
    online: bool


class Team(APIModel):
    name: str
    description: str
    members: int


class Article(APIModel):
    title: str
    status: str
    category: str
    updated: str


class Feedback(APIModel):
    quote: str
    rating: int
    source: str


class Integration(APIModel):
    name: str
    category: str
    connected: bool


class Notification(APIModel):
    id: int
    title: str
    body: str
    read: bool
    created_at: datetime = Field(alias="createdAt")


class NotificationReadUpdate(APIModel):
    read: bool


class SettingsResponse(APIModel):
    theme: str
    notifications_enabled: bool = Field(alias="notificationsEnabled")
    language: str
    timezone: str


class SettingsUpdate(APIModel):
    theme: str | None = None
    notifications_enabled: bool | None = Field(default=None, alias="notificationsEnabled")
    language: str | None = None
    timezone: str | None = None


class SlaCompliance(APIModel):
    rate: float
    target: float
    breaches: int
    trend: float


class CsatNps(APIModel):
    csat: float
    nps: int
    responses: int


class Workload(APIModel):
    open_tickets: int = Field(alias="openTickets")
    avg_resolution_minutes: int = Field(alias="avgResolutionMinutes")
    agents_online: int = Field(alias="agentsOnline")


class HealthResponse(APIModel):
    status: str
    database: str
    version: str
