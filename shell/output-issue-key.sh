#!/bin/bash

function makeoutput() {
  local jsonData=$1
  local jsonKey=$2
  local variableName=$3

  # Use eval to handle dynamic variable names
  local value=$(echo "$jsonData" | jq -r --arg key "$jsonKey" '.[$key].text')
  
  if [[ "$value" != "*No response*" ]]; then
    eval $variableName="'$value'"
    
    # Output to GitHub and echo
    echo "${variableName}=${value}" >> "$GITHUB_OUTPUT"
    echo "$value"
  fi
}