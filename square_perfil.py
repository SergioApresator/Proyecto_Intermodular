import re

filepath = 'Frontend/src/app/perfil/perfil.css'
with open(filepath, 'r') as f:
    content = f.read()

# Replacements mapping
# We use regex to ensure we only replace border-radius lines
replacements = [
    (r'(border-radius:\s*)24px;', r'\g<1>0px;'),
    (r'(border-radius:\s*)24px 24px 0 0;', r'\g<1>0;'),
    (r'(border-radius:\s*)30px;', r'\g<1>0px;'),
    (r'(border-radius:\s*)20px;', r'\g<1>4px;'),
    (r'(border-radius:\s*)16px;', r'\g<1>0px;'), # Cards and images to 0px
    (r'(border-radius:\s*)14px;', r'\g<1>0px;'),
    (r'(border-radius:\s*)12px;', r'\g<1>0px;'),
    (r'(border-radius:\s*)10px;', r'\g<1>0px;'),
    (r'(border-radius:\s*)8px;', r'\g<1>0px;')
]

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content)

with open(filepath, 'w') as f:
    f.write(content)

print("Squared off perfil.css")
