from motor.motor_asyncio import AsyncIOMotorDatabase

LOREM = (
    "Figma ipsum component variant main layer. "
    "Prototype pixel flows hand vertical. Layer blur pixel pencil content."
)
DESCRIPTION = (
    "Figma ipsum component variant main layer. "
    "Prototype pixel flows hand vertical."
)

SEED_DATA: dict[str, tuple[list[dict], str]] = {
    "kpis": (
        [
            {
                "range": "Last week",
                "label": "Current Tickets",
                "icon": "Ticket",
                "value": "3,484",
                "delta": 7.1,
                "data": [8, 12, 10, 18, 11, 16, 9, 14, 12, 15, 10],
            },
            {
                "range": "Last week",
                "label": "Daily Avg. Resolution",
                "icon": "Zap",
                "value": "486",
                "delta": 2,
                "data": [6, 8, 7, 12, 9, 14, 10, 15, 11, 9, 13],
            },
            {
                "range": "Last week",
                "label": "SLA Compliance Rate",
                "icon": "Gauge",
                "value": "92%",
                "delta": -1.3,
                "data": [10, 14, 9, 16, 11, 15, 12, 17, 10, 14, 12],
            },
            {
                "range": "This week",
                "label": "Current Tickets",
                "icon": "Ticket",
                "value": "1,902",
                "delta": 3.4,
                "data": [6, 9, 12, 10, 14, 11, 13, 9, 15, 12, 16],
            },
            {
                "range": "This week",
                "label": "Daily Avg. Resolution",
                "icon": "Zap",
                "value": "512",
                "delta": 5.3,
                "data": [7, 9, 8, 11, 13, 12, 14, 15, 16, 13, 17],
            },
            {
                "range": "This week",
                "label": "SLA Compliance Rate",
                "icon": "Gauge",
                "value": "94%",
                "delta": 2.1,
                "data": [9, 11, 10, 13, 12, 14, 13, 15, 14, 16, 15],
            },
            {
                "range": "Last month",
                "label": "Current Tickets",
                "icon": "Ticket",
                "value": "14,208",
                "delta": 11.4,
                "data": [7, 9, 13, 11, 15, 12, 16, 14, 18, 15, 17, 19, 16, 18],
            },
            {
                "range": "Last month",
                "label": "Daily Avg. Resolution",
                "icon": "Zap",
                "value": "498",
                "delta": 4.8,
                "data": [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 15, 17, 16, 18],
            },
            {
                "range": "Last month",
                "label": "SLA Compliance Rate",
                "icon": "Gauge",
                "value": "91%",
                "delta": -0.8,
                "data": [12, 15, 11, 16, 13, 17, 14, 18, 15, 17, 16, 19, 17, 18],
            },
            {
                "range": "This month",
                "label": "Current Tickets",
                "icon": "Ticket",
                "value": "8,641",
                "delta": 6.2,
                "data": [9, 12, 11, 14, 13, 16, 15, 18, 17, 19, 18, 20, 19, 21],
            },
            {
                "range": "This month",
                "label": "Daily Avg. Resolution",
                "icon": "Zap",
                "value": "521",
                "delta": 5.9,
                "data": [10, 11, 13, 12, 15, 14, 16, 15, 18, 17, 19, 18, 20, 19],
            },
            {
                "range": "This month",
                "label": "SLA Compliance Rate",
                "icon": "Gauge",
                "value": "93%",
                "delta": 1.6,
                "data": [11, 13, 12, 15, 14, 16, 15, 17, 16, 18, 17, 19, 18, 20],
            },
        ],
        "range_label",
    ),
    "ticket_volume": (
        [
            {
                "range": "Last week",
                "total": "4,790",
                "totalDelta": 8,
                "days": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "axis": [800, 600, 400, 200, 0],
                "bars": [620, 680, 740, 590, 760, 700, 700],
            },
            {
                "range": "This week",
                "total": "2,615",
                "totalDelta": -4,
                "days": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "axis": [800, 600, 400, 200, 0],
                "bars": [280, 340, 420, 390, 360, 470, 355],
            },
            {
                "range": "Last month",
                "total": "18,420",
                "totalDelta": 11,
                "days": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "axis": [6000, 4500, 3000, 1500, 0],
                "bars": [4200, 4600, 4800, 4820],
            },
            {
                "range": "This month",
                "total": "12,860",
                "totalDelta": 7,
                "days": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "axis": [4000, 3000, 2000, 1000, 0],
                "bars": [2800, 3100, 3400, 3560],
            },
        ],
        "range",
    ),
    "activities": (
        [
            {"tab": "Today", "type": "ticket_updated", "icon": "Ticket", "tone": "text-blue-500", "title": "Ticket Updated", "time": "11:20 AM", "body": "Ticket <b>#2319</b> SLA updated", "bodyText": "Ticket #2319 SLA updated"},
            {"tab": "Today", "type": "client_added", "icon": "UserCheck", "tone": "text-emerald-500", "title": "New Client Added", "time": "11:15 AM", "body": "PT. Alpha Indonesia registered", "bodyText": "PT. Alpha Indonesia registered"},
            {"tab": "Today", "type": "agent_reassigned", "icon": "Repeat2", "tone": "text-violet-500", "title": "Agent Reassigned", "time": "11:00 AM", "body": "Ticket <b>#2322</b> moved to <b>Michael Wong</b>", "bodyText": "Ticket #2322 moved to Michael Wong"},
            {"tab": "Today", "type": "sla_breach_risk", "icon": "TriangleAlert", "tone": "text-red-500", "title": "SLA Breach Risk", "time": "10:45 AM", "body": "Ticket <b>#2320</b> \"Login issue\"", "bodyText": "Ticket #2320 \"Login issue\""},
            {"tab": "Today", "type": "knowledge_base", "icon": "BookOpen", "tone": "text-teal-500", "title": "Knowledge Base", "time": "10:30 AM", "body": "New article published: \"<b>Login Troubleshooting</b>\"", "bodyText": "New article published: \"Login Troubleshooting\""},
            {"tab": "Today", "type": "customer_feedback", "icon": "Star", "tone": "text-amber-500", "title": "Customer Feedback", "time": "10:30 AM", "body": "<b>\"Great support response, thanks Sarah!\"</b>", "bodyText": "\"Great support response, thanks Sarah!\""},
            {"tab": "Today", "type": "ticket_updated", "icon": "Ticket", "tone": "text-blue-500", "title": "Ticket Updated", "time": "09:50 AM", "body": "Ticket <b>#2318</b> closed", "bodyText": "Ticket #2318 closed"},
            {"tab": "Today", "type": "client_added", "icon": "UserCheck", "tone": "text-emerald-500", "title": "New Client Added", "time": "09:10 AM", "body": "Northwind Ltd. registered", "bodyText": "Northwind Ltd. registered"},
            {"tab": "Yesterday", "type": "sla_breach_risk", "icon": "TriangleAlert", "tone": "text-red-500", "title": "SLA Breach Risk", "time": "04:40 PM", "body": "Ticket <b>#2315</b> \"Refund delay\"", "bodyText": "Ticket #2315 \"Refund delay\""},
            {"tab": "Yesterday", "type": "customer_feedback", "icon": "Star", "tone": "text-amber-500", "title": "Customer Feedback", "time": "02:15 PM", "body": "<b>\"Quick and friendly, 5 stars\"</b>", "bodyText": "\"Quick and friendly, 5 stars\""},
            {"tab": "Yesterday", "type": "agent_reassigned", "icon": "Repeat2", "tone": "text-violet-500", "title": "Agent Reassigned", "time": "11:05 AM", "body": "Ticket <b>#2311</b> moved to <b>Sarah Lee</b>", "bodyText": "Ticket #2311 moved to Sarah Lee"},
            {"tab": "This week", "type": "knowledge_base", "icon": "BookOpen", "tone": "text-teal-500", "title": "Knowledge Base", "time": "Mon", "body": "Updated \"<b>Billing FAQ</b>\"", "bodyText": "Updated \"Billing FAQ\""},
            {"tab": "This week", "type": "client_added", "icon": "UserCheck", "tone": "text-emerald-500", "title": "New Client Added", "time": "Mon", "body": "Acme Corp registered", "bodyText": "Acme Corp registered"},
        ],
        "id",
    ),
    "tickets": (
        [
            {"id": 2319, "subject": "Payment failed on invoice", "priority": "High", "agent": "John Doe", "status": "In Review", "created": "2025-08-18", "due": "2h left", "dueH": 2},
            {"id": 2320, "subject": "Login issue", "priority": "Medium", "agent": "Sarah Lee", "status": "Delivered", "created": "2025-08-19", "due": "1h left", "dueH": 1},
            {"id": 2321, "subject": "Feature request export", "priority": "Low", "agent": "John Doe", "status": "In Progress", "created": "2025-08-19", "due": "1d left", "dueH": 24},
            {"id": 2322, "subject": "Contract renewal issue", "priority": "Medium", "agent": "Michael Wong", "status": "In Progress", "created": "2025-08-20", "due": "9h left", "dueH": 9},
        ],
        "id",
    ),
    "users": (
        [
            {
                "name": "Samantha Walker",
                "email": "samanwalker@gmail.com",
                "avatarInitials": "SW",
                "online": True,
                "theme": "light",
                "role": "Support Manager",
            }
        ],
        "email",
    ),
    "widgets": (
        [
            {"slug": "activity", "eyebrow": "Activity widget", "title": "Daily Writing", "description": "A focus timer with a progress ring. Start it, pause it, hit your daily goal.", "path": "/activity", "icon": "Timer", "config": {"label": "Activity", "title": "Daily Writing", "goalMinutes": 30, "remainingMinutes": 10}},
            {"slug": "weather", "eyebrow": "Weather widget", "title": "Local forecast", "description": "Current temperature with an hourly forecast strip. Tap a time slot to preview it.", "path": "/weather", "icon": "Cloud", "config": {"location": "Palo Alto", "icon": "Cloud", "forecast": [{"time": "Now", "temp": 12}, {"time": "14:00", "temp": 15}, {"time": "15:00", "temp": 16}, {"time": "16:00", "temp": 17}]}},
            {"slug": "feature", "eyebrow": "Feature widget", "title": "Feature showcase", "description": "A sliding feature card. Use the pager dots to flip through slides.", "path": "/feature", "icon": "Flame", "config": {"icon": "Flame", "defaultIndex": 1, "interval": 4000, "slides": [{"title": "Figma ipsum component", "description": LOREM} for _ in range(5)]}},
            {"slug": "sales", "eyebrow": "Sales widget", "title": "Sales report", "description": "Summary, monthly and yearly stats, plus a regional breakdown.", "path": "/sales", "icon": "ChartNoAxesCombined", "config": {"title": "Sales Report", "summaryLabel": "Summary", "summary": 22870, "currency": "$", "monthly": {"value": 8097, "change": "19.6%", "secondary": "44.714 USD"}, "yearly": {"value": 312134, "change": "2.6%", "secondary": "301.002 USD"}, "regions": [{"name": "Los Angeles", "value": "201,192"}, {"name": "New York", "value": "192.054"}, {"name": "Canada", "value": "166.401"}]}},
            {"slug": "insight", "eyebrow": "Insight widget", "title": "Performance insight", "description": "A headline metric with trend indicator. Page through the insight slides.", "path": "/insight", "icon": "TrendingUp", "config": {"label": "Insight", "location": "Palo Alto", "defaultIndex": 1, "interval": 4000, "slides": [{"value": value, "title": "Figma ipsum component", "description": LOREM} for value in [72, 89, 64, 91, 78]]}},
            {"slug": "stat", "eyebrow": "Stat widget", "title": "Key stat", "description": "A single bold percentage with a vertical pager for more slides.", "path": "/stat", "icon": "Percent", "config": {"defaultIndex": 1, "interval": 4000, "slides": [{"value": value, "title": "Figma ipsum component", "description": DESCRIPTION} for value in [72, 89, 64]]}},
        ],
        "slug",
    ),
    "weather": ([{"location": "Palo Alto", "icon": "Cloud", "forecast": [{"time": "Now", "temp": 12}, {"time": "14:00", "temp": 15}, {"time": "15:00", "temp": 16}, {"time": "16:00", "temp": 17}]}], "location"),
    "sales_reports": (
        [
            {
                "title": "Sales Report",
                "summaryLabel": "Summary",
                "summary": 22870,
                "currency": "$",
                "monthly": {"value": 8097, "change": "19.6%", "secondary": "44.714 USD"},
                "yearly": {"value": 312134, "change": "2.6%", "secondary": "301.002 USD"},
                "regions": [{"name": "Los Angeles", "value": "201,192"}, {"name": "New York", "value": "192.054"}, {"name": "Canada", "value": "166.401"}],
            }
        ],
        "title",
    ),
    "clients": (
        [
            {"name": "PT. Alpha Indonesia", "industry": "Technology", "status": "Active"},
            {"name": "Northwind Ltd.", "industry": "Retail", "status": "Active"},
            {"name": "Acme Corp", "industry": "Manufacturing", "status": "Active"},
        ],
        "name",
    ),
    "agents": (
        [
            {"name": "John Doe", "team": "Support Tier 1", "role": "Support Agent", "online": True},
            {"name": "Sarah Lee", "team": "Support Tier 1", "role": "Support Agent", "online": True},
            {"name": "Michael Wong", "team": "Escalations", "role": "Senior Support Agent", "online": True},
        ],
        "name",
    ),
    "teams": (
        [
            {"name": "Support Tier 1", "description": "First response and general support", "members": 2},
            {"name": "Escalations", "description": "Complex and SLA-at-risk tickets", "members": 1},
        ],
        "name",
    ),
    "articles": (
        [
            {"title": "Login Troubleshooting", "status": "published", "category": "Account", "updated": "2025-08-20"},
            {"title": "Billing FAQ", "status": "published", "category": "Billing", "updated": "2025-08-17"},
            {"title": "Exporting Reports", "status": "draft", "category": "Reports", "updated": "2025-08-15"},
        ],
        "title",
    ),
    "feedback": (
        [
            {"quote": "Great support response, thanks Sarah!", "rating": 5, "source": "Customer Feedback"},
            {"quote": "Quick and friendly, 5 stars", "rating": 5, "source": "Customer Feedback"},
        ],
        "quote",
    ),
    "integrations": (
        [
            {"name": "Zendesk", "category": "Support", "connected": True},
            {"name": "Slack", "category": "Communication", "connected": True},
            {"name": "HubSpot", "category": "CRM", "connected": False},
        ],
        "name",
    ),
    "notifications": (
        [
            {"id": 1, "title": "SLA breach risk", "body": "Ticket #2320 \"Login issue\" is due in 1h", "read": False, "createdAt": "2025-08-20T09:30:00"},
            {"id": 2, "title": "New client", "body": "PT. Alpha Indonesia registered", "read": True, "createdAt": "2025-08-20T09:15:00"},
        ],
        "title",
    ),
    "settings": (
        [
            {"theme": "light", "notificationsEnabled": True, "language": "en", "timezone": "UTC"},
        ],
        "language",
    ),
    "analytics_sla": ([{"rate": 92, "target": 95, "breaches": 3, "trend": -1.3}], "rate"),
    "analytics_csat": ([{"csat": 4.6, "nps": 62, "responses": 128}], "csat"),
    "analytics_workload": ([{"openTickets": 1902, "avgResolutionMinutes": 512, "agentsOnline": 3}], "openTickets"),
}


def _key_for(doc: dict, key: str) -> dict:
    if key == "range_label":
        return {"range": doc["range"], "label": doc["label"]}
    return {key: doc[key]}


async def seed_database(db: AsyncIOMotorDatabase) -> None:
    for index, document in enumerate(SEED_DATA["activities"][0], start=1):
        document.setdefault("id", index)

    for collection_name, (documents, key) in SEED_DATA.items():
        collection = db[collection_name]
        for document in documents:
            update = {"$set": document} if collection_name == "ticket_volume" else {"$setOnInsert": document}
            await collection.update_one(
                _key_for(document, key),
                update,
                upsert=True,
            )

    for notification in SEED_DATA["notifications"][0]:
        await db["notifications"].update_one(
            {"title": notification["title"]},
            {"$set": {"id": notification["id"]}},
        )

    await db["counters"].update_one(
        {"_id": "ticket"},
        {"$setOnInsert": {"seq": 2322}},
        upsert=True,
    )
    await db["counters"].update_one(
        {"_id": "activity"},
        {
            "$setOnInsert": {
                "seq": max(item["id"] for item in SEED_DATA["activities"][0])
            }
        },
        upsert=True,
    )
