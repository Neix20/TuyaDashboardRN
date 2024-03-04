#!/bin/bash

file_path=$1

# Use grep to extract the version code
version_code=$(grep -Eo "versionCode [0-9]+" $file_path | sed -E 's/versionCode //' | head -n 1)

# Update New Version Code
new_version_code=$((version_code + 1))

sed -i '' "s/${version_code}/${new_version_code}/g" $file_path

echo "Replacement successful."