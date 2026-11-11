from pathlib import Path
import shutil
import zipfile

root = Path(__file__).resolve().parents[1]
folders = ['assets','config','layout','locales','sections','snippets','templates']
output = root / 'downloads' / 'teste-videira-shopify.zip'
output.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for folder in folders:
        for file in sorted((root / folder).rglob('*')):
            if file.is_file():
                archive.write(file, file.relative_to(root))
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    assert all(name.split('/')[0] in folders for name in archive.namelist())
    assert 'layout/theme.liquid' in archive.namelist()
    assert 'templates/index.json' in archive.namelist()
    print(f'ZIP aprovado: {len(archive.namelist())} arquivos; {output.stat().st_size} bytes')
shutil.copy2(output, root.parent / 'Teste-Videira-Shopify.zip')
