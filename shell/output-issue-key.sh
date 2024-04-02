#!/bin/bash

function makeoutput() {
  local jsonData=$1
  local jsonKey=$2
  local variableName=$3
  local type=$4

  # Use eval to handle dynamic variable names
  local value=$(echo "$jsonData" | jq -r --arg key "$jsonKey" '.[$key].text')

  case $type in
    "string")
      # No additional validation/sanitization needed for string type
      ;;
    "username")
      # Remove leading @ symbol if it exists
      value=${value#@}
      ;;
    "url")
      # Validate URL against regex
      if [[ ! $value =~ ^(https?|ftp)://[^\s/$.?#].[^\s]*$ ]]; then
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