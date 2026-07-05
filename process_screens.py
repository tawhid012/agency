import os

screen_map = {
    "3f5565fd300e445887f1a7a6913e6c23": "index",
    "5fb180ddb0b848ca9ba2cd65f75d61d8": "agency",
    "828535c38fea4ca2ad6a9ea1d3009f65": "labs",
    "a378225588db4bdf964a2072aa56b880": "careers",
    "d8e12af6c4794f34becccd5096b17e09": "academy",
    "e553f1a5ae4d4f6ba94e63cc307213ad": "contact",
    "e583dc4639f2498f9627fca7bee36ae9": "community",
    "e931b2d5d30b4ebda08daee3e990f489": "portfolio",
    "de23672d6f8342d7a3056b9394b417cb": "shader"
}

to_delete = [
    "6e021ad9d30b487f8eefcaea269e8c64.png",
    "a3bc3d20b425407183062216ad568401.png",
    "f8ef73ef09854f1a870398d1b93e14dc.png"
]

screens_dir = "/Users/tawhid_laskar/Desktop/limux/screens"

# Delete files
for filename in to_delete:
    filepath = os.path.join(screens_dir, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        print(f"Deleted: {filename}")

# Rename files
for old_id, new_name in screen_map.items():
    # Rename HTML
    old_html = os.path.join(screens_dir, f"{old_id}.html")
    new_html = os.path.join(screens_dir, f"{new_name}.html")
    if os.path.exists(old_html):
        os.rename(old_html, new_html)
        print(f"Renamed: {old_id}.html -> {new_name}.html")
    
    # Rename PNG
    old_png = os.path.join(screens_dir, f"{old_id}.png")
    new_png = os.path.join(screens_dir, f"{new_name}.png")
    if os.path.exists(old_png):
        os.rename(old_png, new_png)
        print(f"Renamed: {old_id}.png -> {new_name}.png")

# Replace strings inside HTML files
for filename in os.listdir(screens_dir):
    if filename.endswith(".html"):
        filepath = os.path.join(screens_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Replace occurrences of old IDs with new html files
        for old_id, new_name in screen_map.items():
            content = content.replace(f"{old_id}", f"{new_name}")
            
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated references in: {filename}")

print("Processing complete.")
