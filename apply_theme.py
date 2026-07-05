import os
import re

screens_dir = "/Users/tawhid_laskar/Desktop/limux/screens"

for filename in os.listdir(screens_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(screens_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Remove neon-orb
        content = re.sub(r'<div class="neon-orb[^>]*></div>\s*', '', content)
        
        # Add 'glass-card' to elements that look like cards (e.g. they have bg-surface and rounded corners)
        # Actually, let's just make sure <body class="..."> doesn't override our gradient
        # Let's remove bg-background from body so the css body background shows through
        content = re.sub(r'<body class="([^"]*)bg-background([^"]*)"', r'<body class="\1\2"', content)
        
        # Give buttons the btn-primary class if they are primary CTA
        # Just match <button class="... text-on-primary ..."> -> <button class="btn-primary ...">
        content = re.sub(r'class="([^"]*?)bg-primary([^"]*?)"', r'class="\1btn-primary\2"', content)

        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Processed: {filename}")
