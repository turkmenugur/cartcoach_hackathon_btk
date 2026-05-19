import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict

from agents import is_gemini_configured
from main import run_cartcoach_analysis
from supabase_client import is_supabase_configured, supabase_select
from tools import get_product_catalog, process_automation_outbox


HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))



class BuffStoreApiHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: Dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self._send_json(200, {"ok": True})

    def do_GET(self) -> None:
        if self.path == "/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "service": "buff-store-agent-api",
                    "supabase_configured": is_supabase_configured(),
                    "gemini_configured": is_gemini_configured(),
                },
            )
            return

        if self.path == "/products":
            self._send_json(200, get_product_catalog())
            return

        if self.path == "/agent-events":
            rows = supabase_select(
                "buff_agent_events",
                {"select": "*", "order": "created_at.desc", "limit": "20"},
            )
            self._send_json(200, {"source": "supabase" if rows else "empty", "events": rows})
            return

        if self.path == "/automation-outbox":
            rows = supabase_select(
                "buff_automation_outbox",
                {"select": "*", "order": "created_at.desc", "limit": "20"},
            )
            self._send_json(200, {"source": "supabase" if rows else "empty", "events": rows})
            return

        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path == "/process-automation":
            result = process_automation_outbox()
            self._send_json(200, result)
            return

        if self.path != "/analyze-cart":
            self._send_json(404, {"error": "Not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(length).decode("utf-8")
            payload = json.loads(raw_body or "{}")
            user_data = payload.get("user_data", payload)
            result = run_cartcoach_analysis(user_data)
            self._send_json(200, result)
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON"})
        except Exception as exc:
            self._send_json(
                500,
                {
                    "error": "BUFF Store analysis failed",
                    "detail": str(exc),
                    "fallback_message": (
                        "Sepetiniz icin size yardimci olacak kisa bir teklif hazirladik. "
                        "Lutfen birazdan tekrar deneyin."
                    ),
                },
            )

    def log_message(self, format: str, *args: Any) -> None:
        print(f"[BUFF Store API] {self.address_string()} - {format % args}")


def run_server() -> None:
    server = ThreadingHTTPServer((HOST, PORT), BuffStoreApiHandler)
    print(f"BUFF Store agent API running at http://{HOST}:{PORT}")
    print("Health check: http://127.0.0.1:8000/health")
    server.serve_forever()


if __name__ == "__main__":
    run_server()
