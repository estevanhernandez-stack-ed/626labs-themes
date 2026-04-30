"""626 Labs — sample Python surface for the theme preview.

Cyan owns logic. Magenta owns control flow. Green owns content.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Optional


BRAND = {
    "cyan": "#17d4fa",
    "magenta": "#f22f89",
    "navy": "#0a1524",
}


@dataclass(frozen=True)
class Decision:
    """A single architectural decision logged for The Architect."""

    id: str
    title: str
    stakes: str = "medium"
    tags: tuple[str, ...] = field(default_factory=tuple)
    notes: Optional[str] = None

    def is_high_stakes(self) -> bool:
        return self.stakes == "high"


class Architect:
    def __init__(self, storage: Path) -> None:
        self.storage = storage
        self.history: list[Decision] = []

    def log(self, decision: Decision) -> Decision:
        self.history.append(decision)
        return decision

    def recent(self, limit: int = 10) -> Iterable[Decision]:
        yield from reversed(self.history[-limit:])

    def hydrate(self) -> int:
        raw = json.loads(self.storage.read_text(encoding="utf-8"))
        for entry in raw:
            decision = Decision(**entry)
            if decision.is_high_stakes():
                print(f"high-stakes: {decision.id}")
            self.history.append(decision)
        return len(raw)


def main() -> None:
    arch = Architect(Path("./decisions.json"))
    count = arch.hydrate()
    print(f"hydrated {count} decisions, brand={BRAND['cyan']}")


if __name__ == "__main__":
    main()
