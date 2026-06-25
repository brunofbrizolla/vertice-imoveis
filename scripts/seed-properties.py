# -*- coding: utf-8 -*-
"""Corrige/insere imóveis reais via API local (que usa supabaseAdmin).
Envia UTF-8 corretamente (json.dumps(...).encode('utf-8')) para evitar a
corrupção de acentos que acontece ao passar UTF-8 pelo argumento do shell.
"""
import json, urllib.request

API = "http://localhost:3000/api/properties"

def req(method, payload):
    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    r = urllib.request.Request(API, data=data, method=method,
                               headers={"Content-Type": "application/json; charset=utf-8"})
    with urllib.request.urlopen(r, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))

# registros já criados (corrompidos) -> atualizar pelo id
UPDATES = [
    {
        "id": "ad0dc805-0015-42de-86af-856bf10cb023",
        "title": "Área de 16.919 m² – Almirante Tamandaré",
        "price": "R$ 5.500.000",
        "price_label": "",
        "type": "Venda",
        "location": "Almirante Tamandaré – PR",
        "beds": "Terreno",
        "baths": "Lote/Área",
        "area": "16.919,51 m²",
        "img": "/logo-emblem.webp",
        "property_type": "Terreno",
        "description": "Área de 16.919,51 m² em Almirante Tamandaré/PR (Colônia Antonio Prado), localizada ao lado do asilo. Excelente oportunidade para investimento, incorporação ou loteamento.",
        "images": [],
        "features": ["Área de 16.919,51 m²", "Almirante Tamandaré/PR", "Ao lado do asilo", "Ideal para incorporação"],
    },
    {
        "id": "aec74f0a-0240-458d-8bcb-8b7e21c2456f",
        "title": "Área de 13.742 m² (1,37 ha) – Almirante Tamandaré",
        "price": "Sob consulta",
        "price_label": "",
        "type": "Venda",
        "location": "Almirante Tamandaré – PR",
        "beds": "Terreno",
        "baths": "Lote/Área",
        "area": "13.742 m²",
        "img": "/logo-emblem.webp",
        "property_type": "Terreno",
        "description": "Área de aproximadamente 13.742 m² (1,37 hectare) em Almirante Tamandaré/PR. Ótima oportunidade de investimento.",
        "images": [],
        "features": ["Área de 13.742 m²", "1,37 hectare", "Almirante Tamandaré/PR"],
    },
]

for u in UPDATES:
    out = req("PUT", u)
    ok = out.get("id") == u["id"]
    print(("OK  " if ok else "ERRO") + " -> " + str(out.get("title") or out))
