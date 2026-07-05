import os
import re

screens_dir = "/Users/tawhid_laskar/Desktop/limux/screens"

link_map = {
    ">Ecosystem<": 'href="index.html">Ecosystem<',
    ">Services<": 'href="agency.html">Services<',
    ">Projects<": 'href="portfolio.html">Projects<',
    ">Vision<": 'href="labs.html">Vision<',
    ">Careers<": 'href="careers.html">Careers<',
    ">Academy<": 'href="academy.html">Academy<',
    ">Contact<": 'href="contact.html">Contact<',
    ">Community<": 'href="community.html">Community<',
    ">Architecture<": 'href="shader.html">Architecture<',
}

for filename in os.listdir(screens_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(screens_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Replace href="#" for logo if it exists
        content = content.replace('href="#">LIMUX</a>', 'href="index.html">LIMUX</a>')
        
        # Convert <div> logo to <a> logo
        content = re.sub(r'<div([^>]*>LIMUX</div>)', r'<a href="index.html"\1</a>', content)
        content = content.replace('</a></div>', '</a>') # Fix if any malformed replacing happened
        
        # We need to only replace href="#" when followed by the text
        for text, new_href in link_map.items():
            # regex: href="#" followed by anything inside the tag, then the text
            # basically replace `href="#"(.*?)>Text<` with `href="file.html"\1>Text<`
            # But the text in link_map already includes > and <
            
            # Find the text in the map without the brackets
            inner_text = text[1:-1]
            pattern = r'href="#"([^>]*)>' + inner_text + r'<'
            replacement = r'href="' + new_href.split('"')[1] + r'"\1>' + inner_text + r'<'
            
            content = re.sub(pattern, replacement, content)
            
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated links in: {filename}")
