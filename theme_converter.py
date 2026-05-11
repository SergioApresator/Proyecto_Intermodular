import os
import re

files_to_convert = [
    'Frontend/src/app/juego-detalle/juego-detalle.css',
    'Frontend/src/app/perfil/perfil.css',
    'Frontend/src/app/ver-todos/ver-todos.css',
    'Frontend/src/app/login/login.css',
    'Frontend/src/app/registro/registro.css'
]

color_map = {
    r'#0f172a': '#f8fafc',  # Main Background
    r'#1e293b': '#ffffff',  # Card Background
    r'#1a202c': '#ffffff',  # Alt Card Background
    r'#334155': '#e2e8f0',  # Borders / Secondary Bg
    r'#475569': '#cbd5e1',  # Hover borders
    r'#f1f5f9': '#1e293b',  # Main Text
    r'#e2e8f0': '#334155',  # Alt Text
    r'#cbd5e1': '#475569',  # Muted Text 1
    r'#94a3b8': '#64748b',  # Muted Text 2
    r'#fff(fff)?\b': '#1e293b',  # Pure White to Dark Slate
    r'rgba\(30, 41, 59, (0\.\d+)\)': r'rgba(255, 255, 255, \1)',  # Dark overlay to light overlay
    r'rgba\(255, 255, 255, 0\.05\)': 'rgba(0, 0, 0, 0.05)',  # Light borders to dark borders
    r'rgba\(255, 255, 255, 0\.1\)': 'rgba(0, 0, 0, 0.1)',
    r'rgba\(255, 255, 255, 0\.2\)': 'rgba(0, 0, 0, 0.15)',
    r'rgba\(15, 23, 42,': r'rgba(248, 250, 252,',
    r'rgba\(26, 32, 44,': r'rgba(255, 255, 255,'
}

for filepath in files_to_convert:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        for old_color, new_color in color_map.items():
            content = re.sub(old_color, new_color, content, flags=re.IGNORECASE)
        
        # Exceptions: Buttons like btn-primario should keep white text
        content = re.sub(r'(\.btn-[a-z]+[^{]*\{[^}]*color:\s*)#1e293b', r'\1#ffffff', content)
        content = re.sub(r'(\.badge[^{]*\{[^}]*color:\s*)#1e293b', r'\1#ffffff', content)
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Converted {filepath}")
    else:
        print(f"File not found: {filepath}")
