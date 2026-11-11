"""Valida schemas Shopify, referências internas e integridade do tema sem rede."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
sections = {}
checks = 0
for p in (root / 'sections').glob('*.liquid'):
    source = p.read_text()
    matches = re.findall(r'{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}', source)
    assert len(matches) == 1, p
    schema = json.loads(matches[0])
    assert len(schema['name']) <= 25, (p, 'Nome de seção acima de 25 caracteres')
    ids = [s['id'] for s in schema.get('settings', []) if 'id' in s]
    assert len(ids) == len(set(ids)), p
    sections[p.stem] = schema
    checks += 1

for p in list((root / 'templates').glob('*.json')) + list((root / 'sections').glob('*-group.json')):
    template = json.loads(p.read_text())
    assert set(template['order']) == set(template['sections']), p
    assert len(template['order']) == len(set(template['order'])), p
    for section in template['sections'].values():
        schema = sections[section['type']]
        settings = {s['id']: s for s in schema.get('settings', []) if 'id' in s}
        assert set(section.get('settings', {})) <= set(settings), (p, section['type'])
        for key, value in section.get('settings', {}).items():
            spec = settings[key]
            if spec['type'] == 'range':
                assert spec['min'] <= value <= spec['max'], (p, key)
        blocks = section.get('blocks', {})
        assert set(section.get('block_order', [])) == set(blocks), p
        block_types = {b['type']: b for b in schema.get('blocks', [])}
        for block in blocks.values():
            allowed = {s['id'] for s in block_types[block['type']].get('settings', []) if 'id' in s}
            assert set(block.get('settings', {})) <= allowed, p
    checks += 1

for p in root.rglob('*.liquid'):
    source = p.read_text()
    for snippet in re.findall(r"{%\s*render\s+'([^']+)'", source):
        assert (root / 'snippets' / (snippet + '.liquid')).is_file(), (p, snippet)
    for asset in re.findall(r"'([^']+)'\s*\|\s*asset_url", source):
        assert (root / 'assets' / asset).is_file(), (p, asset)
    checks += 1

for p in (root / 'config').glob('*.json'):
    json.loads(p.read_text())
for p in (root / 'locales').glob('*.json'):
    json.loads(p.read_text())
css = (root / 'assets/videira-storefront.css').read_text()
assert css.count('{') == css.count('}'), 'CSS novo com blocos desbalanceados'

assert 'videira.vinhoteca' not in (root / 'sections/videira-footer.liquid').read_text()
assert 'instagram.com/videiravinhoteca/' in (root / 'sections/videira-footer.liquid').read_text()
assert 'videira-storefront.css' in (root / 'layout/theme.liquid').read_text()
print(f'PASS: {checks} verificações de arquivos, schemas e referências; JSON, assets, cards e Instagram.')

import hashlib
assert hashlib.sha256((root/'assets/videira-logo.svg').read_bytes()).hexdigest() == '25a508cded1ccf31c143e089ef9f600a71c57f70ab3ffa89f6de01a20d5a78d8', 'Logo original alterada'

assert 'videira-mistral.css' in (root/'layout/theme.liquid').read_text()
