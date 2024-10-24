#!/bin/bash
output_file="combined_nextjs_code.txt"

# Remove the output file if it already exists
rm -f "$output_file"

# Function to process files
process_files() {
  local dir="$1"
  local prefix="$2"

  # Process all items in directory
  for item in "$dir"/*; do
    # Skip if item doesn't exist or is node_modules/.next
    if [[ ! -e "$item" ]] || [[ "$item" == *"node_modules"* ]] || [[ "$item" == *".next"* ]]; then
      continue
    fi

    if [ -d "$item" ]; then
      # For directories, print name and process their contents
      echo "Directory: $prefix$(basename "$item")" >> "$output_file"
      echo "" >> "$output_file"
      # Recursively process the subdirectory with increased prefix
      process_files "$item" "$prefix  "
    elif [ -f "$item" ]; then
      # If it's a file with a relevant extension, print its content
      case "$item" in
        *.js|*.jsx|*.ts|*.tsx|*.css|*.json|*.md)
          if [[ "$item" != *"package-lock.json"* ]]; then
            echo "File: $prefix$(basename "$item")" >> "$output_file"
            echo "" >> "$output_file"
            cat "$item" >> "$output_file"
            echo "" >> "$output_file"
            echo "----------------------------------------" >> "$output_file"
            echo "" >> "$output_file"
          fi
          ;;
      esac
    fi
  done
}

# Process specific configuration files
process_config_files() {
  local files=("next.config.js" "postcss.config.js" "tailwind.config.js" "tsconfig.json" "package.json" "README.md")

  for file in "${files[@]}"; do
    if [ -f "$file" ]; then
      echo "File: $file" >> "$output_file"
      echo "" >> "$output_file"
      cat "$file" >> "$output_file"
      echo "" >> "$output_file"
      echo "----------------------------------------" >> "$output_file"
      echo "" >> "$output_file"
    fi
  done
}

# Start processing from the current directory
process_files "." ""

# Process configuration files
process_config_files

echo "Selected files have been combined into $output_file"