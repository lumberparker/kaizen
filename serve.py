#!/usr/bin/env python3
"""Servidor estático de desarrollo para el sitio KAIZEN.

Igual que `python3 -m http.server`, pero envía cabeceras "no-cache" para que
el navegador siempre cargue la última versión de tu CSS, JS e imágenes.
Así evitas el clásico "cambié algo y no se ve".

Uso:  python3 serve.py [puerto]   (por defecto 4173)
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"KAIZEN dev server → http://localhost:{PORT}  (sin caché)")
        httpd.serve_forever()
