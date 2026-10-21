"""Rebuild hashed, dependency-free browser assets before Sites packaging."""
from pathlib import Path
import hashlib,re,shutil
root=Path(__file__).resolve().parents[1]
dist=root/'dist'; output=dist/'assets/static'
if output.exists():shutil.rmtree(output)
output.mkdir(parents=True)
files=['community.js','script.js','magnetic-button.js','split-text.js','video-reveal.js','deferred-map.js']
bundle='\n;\n'.join((dist/name).read_text() for name in files)
css=re.sub(r'/\*.*?\*/','',(dist/'style.css').read_text(),flags=re.S).strip()
css=css.replace("url('assets/","url('/assets/").replace('url("assets/','url("/assets/')
jsname='site-'+hashlib.sha256(bundle.encode()).hexdigest()[:12]+'.js'
cssname='site-'+hashlib.sha256(css.encode()).hexdigest()[:12]+'.css'
(output/jsname).write_text(bundle);(output/cssname).write_text(css)
p=dist/'index.html'; html=p.read_text()
html=re.sub(r'<script src="(?:assets/static/[^" ]+|(?:'+'|'.join(re.escape(x) for x in files)+r'))" defer></script>','',html)
html=html.replace('</head>',f'<script src="assets/static/{jsname}" defer></script></head>')
html=re.sub(r'<link rel="stylesheet" href="(?:style.css|assets/static/[^" ]+)">',f'<link rel="stylesheet" href="assets/static/{cssname}">',html)
p.write_text(html)
print('Browser bundle:',jsname,'CSS:',cssname)
