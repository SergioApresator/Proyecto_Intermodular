import os
import re

files_to_convert = [
    'Frontend/src/app/juego-detalle/juego-detalle.css',
    'Frontend/src/app/perfil/perfil.css',
    'Frontend/src/app/ver-todos/ver-todos.css',
    'Frontend/src/app/login/login.css',
    'Frontend/src/app/registro/registro.css'
]

def replace_colors(match):
    color = match.group(0).lower()
    mapping = {
        '#0f172a': '#f8fafc',
        '#1e293b': '#ffffff',
        '#1a202c': '#ffffff',
        '#334155': '#e2e8f0',
        '#475569': '#cbd5e1',
        '#f1f5f9': '#1e293b',
        '#e2e8f0': '#334155',
        '#cbd5e1': '#475569',
        '#94a3b8': '#64748b',
        'rgba(30, 41, 59, 0.8)': 'rgba(255, 255, 255, 0.8)',
        'rgba(30, 41, 59, 0.6)': 'rgba(255, 255, 255, 0.6)',
        'rgba(255, 255, 255, 0.05)': 'rgba(0, 0, 0, 0.05)',
        'rgba(255, 255, 255, 0.1)': 'rgba(0, 0, 0, 0.1)',
        'rgba(255, 255, 255, 0.2)': 'rgba(0, 0, 0, 0.15)',
        'rgba(15, 23, 42, 0.5)': 'rgba(255, 255, 255, 0.8)',
        'rgba(15, 23, 42, 0.6)': 'rgba(255, 255, 255, 0.8)',
        'rgba(26, 32, 44, 0.6)': 'rgba(255, 255, 255, 0.9)',
        'rgba(26, 32, 44, 0.8)': '#ffffff',
        '#fff': '#1e293b',
        '#ffffff': '#1e293b',
        'white': '#1e293b'
    }
    
    # We want to match exactly, but some colors might be uppercase or have different spacing
    # Normalization:
    normalized_color = color.replace(' ', '')
    
    # Manual lookup
    if '#0f172a' in normalized_color: return '#f8fafc'
    if '#1e293b' in normalized_color: return '#ffffff'
    if '#1a202c' in normalized_color: return '#ffffff'
    if '#334155' in normalized_color: return '#e2e8f0'
    if '#475569' in normalized_color: return '#cbd5e1'
    if '#f1f5f9' in normalized_color: return '#1e293b'
    if '#e2e8f0' in normalized_color: return '#334155'
    if '#cbd5e1' in normalized_color: return '#475569'
    if '#94a3b8' in normalized_color: return '#64748b'
    if 'rgba(30,41,59,0.8)' in normalized_color: return 'rgba(255, 255, 255, 0.8)'
    if 'rgba(30,41,59,0.6)' in normalized_color: return 'rgba(255, 255, 255, 0.6)'
    if 'rgba(255,255,255,0.05)' in normalized_color: return 'rgba(0, 0, 0, 0.05)'
    if 'rgba(255,255,255,0.1)' in normalized_color: return 'rgba(0, 0, 0, 0.1)'
    if 'rgba(255,255,255,0.2)' in normalized_color: return 'rgba(0, 0, 0, 0.15)'
    if 'rgba(15,23,42,0.5)' in normalized_color: return 'rgba(255, 255, 255, 0.8)'
    if 'rgba(15,23,42,0.6)' in normalized_color: return 'rgba(255, 255, 255, 0.8)'
    if 'rgba(26,32,44,0.6)' in normalized_color: return 'rgba(255, 255, 255, 0.9)'
    if 'rgba(26,32,44,0.8)' in normalized_color: return '#ffffff'
    if '#fff' == normalized_color or '#ffffff' == normalized_color: return '#1e293b'
    if 'white' == normalized_color: return '#1e293b'
    
    return color

# The pattern matches all possible keys
pattern = re.compile(
    r'(#0f172a|#1e293b|#1a202c|#334155|#475569|#f1f5f9|#e2e8f0|#cbd5e1|#94a3b8|'
    r'rgba\(\s*30\s*,\s*41\s*,\s*59\s*,\s*0\.8\s*\)|'
    r'rgba\(\s*30\s*,\s*41\s*,\s*59\s*,\s*0\.6\s*\)|'
    r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.05\s*\)|'
    r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1\s*\)|'
    r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.2\s*\)|'
    r'rgba\(\s*15\s*,\s*23\s*,\s*42\s*,\s*0\.5\s*\)|'
    r'rgba\(\s*15\s*,\s*23\s*,\s*42\s*,\s*0\.6\s*\)|'
    r'rgba\(\s*26\s*,\s*32\s*,\s*44\s*,\s*0\.6\s*\)|'
    r'rgba\(\s*26\s*,\s*32\s*,\s*44\s*,\s*0\.8\s*\)|'
    r'#ffffff|#fff|\bwhite\b)',
    re.IGNORECASE
)

for filepath in files_to_convert:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            
        content = pattern.sub(replace_colors, content)
        
        # Exception fixes: Primary buttons should remain white text
        content = re.sub(r'(color:\s*)#1e293b([^}]*\/\* keep-white \*\/)', r'\1#ffffff\2', content)
        
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Safe-Converted {filepath}")
    else:
        print(f"File not found: {filepath}")
