import re
from pathlib import Path

SEED_FILE: Path = Path(__file__).resolve().parent / "seed_items.sql"
_SEED_ROW_PATTERN: re.Pattern[str] = re.compile(
    r"\('([^']+)',\s*[\d.]+,\s*\d+,\s*'([^']+)'\)"
)


def load_seed_sql() -> str:
    lines: list[str] = [
        line
        for line in SEED_FILE.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]
    return "\n".join(lines)


def image_urls_by_name(sql: str) -> dict[str, str]:
    return dict(_SEED_ROW_PATTERN.findall(sql))
