"""Baixa fotos públicas da própria loja somente para gerar a prévia offline."""
from pathlib import Path
import concurrent.futures
import json
import urllib.request

root = Path(__file__).resolve().parents[1]
catalog = json.loads((root / 'tests/catalog-preview.json').read_text())
destination = root / 'docs/images'
destination.mkdir(exist_ok=True)

def download(item):
    index, product = item
    url = product['image']
    if not url:
        return
    with urllib.request.urlopen(url + ('&' if '?' in url else '?') + 'width=480', timeout=30) as response:
        (destination / f'product-{index}.img').write_bytes(response.read())

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    list(pool.map(download, enumerate(catalog)))
print('Fotos da prévia disponíveis em docs/images (fora do tema).')
