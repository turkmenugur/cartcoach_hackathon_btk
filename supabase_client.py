import json
import os
from typing import Any, Dict, List, Optional
from urllib import error, parse, request


def _supabase_url() -> str:
    return os.environ.get("SUPABASE_URL", "").rstrip("/")


def _supabase_key() -> str:
    return (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        or os.environ.get("SUPABASE_ANON_KEY")
        or ""
    )


def is_supabase_configured() -> bool:
    key = _supabase_key()
    placeholder_keys = {
        "YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE",
        "YOUR_SUPABASE_ANON_KEY_HERE",
    }
    return bool(_supabase_url() and key and key not in placeholder_keys)


def _headers() -> Dict[str, str]:
    key = _supabase_key()
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


def _write_headers(prefer: str = "return=representation") -> Dict[str, str]:
    headers = _headers()
    headers["Prefer"] = prefer
    return headers


def _rest_url(table: str, query: Optional[Dict[str, str]] = None) -> str:
    base = f"{_supabase_url()}/rest/v1/{table}"
    if not query:
        return base
    return f"{base}?{parse.urlencode(query, safe='*,().')}"


def supabase_select(
    table: str,
    query: Optional[Dict[str, str]] = None,
    timeout: int = 5,
) -> List[Dict[str, Any]]:
    if not is_supabase_configured():
        return []

    try:
        req = request.Request(_rest_url(table, query), headers=_headers(), method="GET")
        with request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8") or "[]")
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        print(f"[Supabase Select Error] table={table}: {exc}")
        return []


def supabase_insert(
    table: str,
    payload: Dict[str, Any],
    timeout: int = 5,
) -> List[Dict[str, Any]]:
    if not is_supabase_configured():
        return []

    try:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = request.Request(
            _rest_url(table),
            data=body,
            headers=_write_headers(),
            method="POST",
        )
        with request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8") or "[]")
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        print(f"[Supabase Insert Error] table={table}: {exc}")
        return []


def supabase_upsert(
    table: str,
    payload: Dict[str, Any] | List[Dict[str, Any]],
    on_conflict: str,
    timeout: int = 10,
) -> List[Dict[str, Any]]:
    if not is_supabase_configured():
        return []

    try:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = request.Request(
            _rest_url(table, {"on_conflict": on_conflict}),
            data=body,
            headers=_write_headers("resolution=merge-duplicates,return=representation"),
            method="POST",
        )
        with request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8") or "[]")
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        print(f"[Supabase Upsert Error] table={table}: {exc}")
        return []


def supabase_update(
    table: str,
    payload: Dict[str, Any],
    query: Dict[str, str],
    timeout: int = 10,
) -> List[Dict[str, Any]]:
    if not is_supabase_configured():
        return []

    try:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        req = request.Request(
            _rest_url(table, query),
            data=body,
            headers=_write_headers(),
            method="PATCH",
        )
        with request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8") or "[]")
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        print(f"[Supabase Update Error] table={table}: {exc}")
        return []
