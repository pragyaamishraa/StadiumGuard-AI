"""
Simulated live data service.

This project does not have access to real stadium IoT sensors, so all crowd
and sustainability figures are SIMULATED for demo purposes. Values are
randomized within realistic bounds on every call to mimic a live feed, and
are clearly labeled as simulated everywhere they're surfaced in the UI.
"""
import random
from datetime import datetime, timezone

GATES = ["Gate A", "Gate B", "Gate C", "Gate D"]
WASHROOMS = ["Washroom - Level 1 North", "Washroom - Level 2 East", "Washroom - Level 1 South"]
FOOD_COURTS = ["Food Court - Gate A", "Food Court - Gate B", "Vegan Zone - Gate C"]
PARKING_LOTS = ["Main Lot (Gate A)", "Overflow Lot (Gate D)"]


def _status_for(occupancy: int) -> str:
    if occupancy >= 90:
        return "critical"
    if occupancy >= 70:
        return "high"
    if occupancy >= 40:
        return "moderate"
    return "low"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_crowd_snapshot() -> dict:
    """Return a simulated snapshot of gate, washroom, food court, and parking load."""
    metrics = []
    for gate in GATES:
        occupancy = random.randint(20, 100)
        metrics.append(
            {
                "location": gate,
                "category": "gate",
                "occupancy_percent": occupancy,
                "status": _status_for(occupancy),
            }
        )
    for washroom in WASHROOMS:
        occupancy = random.randint(10, 95)
        metrics.append(
            {
                "location": washroom,
                "category": "washroom",
                "occupancy_percent": occupancy,
                "status": _status_for(occupancy),
            }
        )
    for court in FOOD_COURTS:
        occupancy = random.randint(15, 100)
        metrics.append(
            {
                "location": court,
                "category": "food_court",
                "occupancy_percent": occupancy,
                "status": _status_for(occupancy),
            }
        )
    for lot in PARKING_LOTS:
        occupancy = random.randint(30, 100)
        metrics.append(
            {
                "location": lot,
                "category": "parking",
                "occupancy_percent": occupancy,
                "status": _status_for(occupancy),
            }
        )
    return {"generated_at": _now_iso(), "metrics": metrics}


def summarize_crowd_metrics(snapshot: dict) -> str:
    """Render a crowd snapshot as plain text for the Gemini recommendation prompt."""
    lines = [
        f"- {m['location']} ({m['category']}): {m['occupancy_percent']}% occupancy, status: {m['status']}"
        for m in snapshot["metrics"]
    ]
    return "\n".join(lines)


def get_sustainability_snapshot() -> dict:
    """Return simulated resource-usage metrics for the sustainability dashboard."""
    metrics = [
        {
            "metric": "Electricity Usage",
            "value": round(random.uniform(4200, 6800), 1),
            "unit": "kWh",
            "trend": random.choice(["up", "down", "stable"]),
        },
        {
            "metric": "Water Usage",
            "value": round(random.uniform(12000, 22000), 1),
            "unit": "liters",
            "trend": random.choice(["up", "down", "stable"]),
        },
        {
            "metric": "Waste Generated",
            "value": round(random.uniform(800, 1600), 1),
            "unit": "kg",
            "trend": random.choice(["up", "down", "stable"]),
        },
        {
            "metric": "Food Waste",
            "value": round(random.uniform(90, 260), 1),
            "unit": "kg",
            "trend": random.choice(["up", "down", "stable"]),
        },
    ]
    return {"generated_at": _now_iso(), "metrics": metrics}


def summarize_sustainability_metrics(snapshot: dict) -> str:
    """Render a sustainability snapshot as plain text for the Gemini prompt."""
    lines = [
        f"- {m['metric']}: {m['value']} {m['unit']} (trend: {m['trend']})"
        for m in snapshot["metrics"]
    ]
    return "\n".join(lines)
