import os
import json

# --- Configuration ---
REPO_USER = "cfopuser"
REPO_NAME = "epub-Jewish-books"
BRANCH = "main" # Or your default branch name

# Directories to scan for EPUB files
DIRECTORIES_TO_SCAN = [
    "daat", "kindle seforim", "orayta", "oyw", 
    "sefaria", "torat emet old", "torat emet website", "תורת אמת"
]

# Output file path (place it inside the docs folder)
OUTPUT_FILE = "docs/data/books.json"

# --- Script Logic ---

def create_download_url(file_path):
    """Creates a raw GitHub content URL for a given file path."""
    # Replace backslashes with forward slashes for URL compatibility
    file_path = file_path.replace("\\", "/")
    return f"https://raw.githubusercontent.com/{REPO_USER}/{REPO_NAME}/{BRANCH}/{file_path}"

def main():
    """Scans directories, finds EPUB files, and generates a JSON file."""
    all_books = []
    
    print("Starting scan for EPUB files...")
    
    for base_dir in DIRECTORIES_TO_SCAN:
        if not os.path.isdir(base_dir):
            print(f"Warning: Directory '{base_dir}' not found. Skipping.")
            continue
            
        for root, _, files in os.walk(base_dir):
            for filename in files:
                if filename.endswith(".epub"):
                    # Clean up the title from the filename
                    title = os.path.splitext(filename)[0]
                    
                    # Get the full path for the URL
                    full_path = os.path.join(root, filename)
                    
                    # Determine category and subcategory
                    path_parts = root.split(os.sep)
                    category = path_parts[0]
                    subcategory = "/".join(path_parts[1:]) if len(path_parts) > 1 else ""
                    
                    book_data = {
                        "title": title,
                        "category": category,
                        "subcategory": subcategory,
                        "path": full_path.replace("\\", "/"),
                        "downloadUrl": create_download_url(full_path)
                    }
                    all_books.append(book_data)

    print(f"Found {len(all_books)} books.")

    # Ensure the output directory exists
    output_dir = os.path.dirname(OUTPUT_FILE)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        # also create the docs/css and docs/js folder to make it easier for the user
        os.makedirs(os.path.join(output_dir, "../css"))
        os.makedirs(os.path.join(output_dir, "../js"))


    # Write the data to the JSON file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully created '{OUTPUT_FILE}'!")


if __name__ == "__main__":
    main()