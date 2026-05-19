from dotenv import load_dotenv
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from buff_catalog import CATALOG_PRODUCTS
from supabase_client import is_supabase_configured, supabase_upsert


def main() -> None:
    load_dotenv()
    if not is_supabase_configured():
        raise SystemExit("Supabase is not configured. Check SUPABASE_URL and key.")

    rows = supabase_upsert(
        "buff_products",
        CATALOG_PRODUCTS,
        on_conflict="product_id",
        timeout=30,
    )
    print(f"seeded_products={len(rows)}")


if __name__ == "__main__":
    main()
