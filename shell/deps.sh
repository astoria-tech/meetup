#!/bin/bash

function makeoutput() {
  local jsonData=$1
  local jsonKey=$2
  local variableName=$3
  local type=$4

  # Use jq to extract the value for the given key
  local value=$(echo "$jsonData" | jq -r --arg key "$jsonKey" '.[$key].text')
  local url_pattern="^(https?://)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(/[-a-zA-Z0-9:%_+.~#?&//=]*)?$"

  case $type in
    "string")
      # No additional validation/sanitization needed for string type
      ;;
    "username")
      # Remove leading @ symbol if it exists
      value=${value#@}
      ;;
    "url")
      # Remove the leading and trailing < and > if they exist
      value=${value#<}
      value=${value%>}
      # Validate URL against regex pattern
      if [[ ! $value =~ $url_pattern ]]; then
        value=""
      fi
      ;;
    "date")
      # Validate date format (YYYY-MM-DD) and check if it's today or in the future within 40 years
      if [[ ! $value =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ || $(date -d "$value" +%s) -lt $(date -d "today" +%s) || $(date -d "$value" +%Y) -gt $(( $(date -d "today" +%Y) + 40 )) ]]; then
        value=""
      fi
      ;;
    *)
      # Invalid type, do nothing
      ;;
  esac

  if [[ -n "$value" ]]; then
    eval $variableName="'$value'"

    # Output to GitHub and echo
    echo "${variableName}=${value}" >> "$GITHUB_OUTPUT"
    echo "$value"
  fi
}

function appendcontent() {
  local content_folder_file_name=$1
  local property_name=$2
  local property_value=$3
  
  if [ -n "$property_value" ]; then
    echo "Appending $property_value"
    echo "$property_name: $property_value" >> "./src/content/$content_folder_file_name.md"
  else
    echo "Not appending $property_value (no value)"
  fi
}