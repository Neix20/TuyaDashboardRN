#!/bin/bash

file_path=$1

convert_ver_to_num() {
    local version=$1
    local major=$(echo "$version" | cut -d '.' -f1)
    local minor=$(echo "$version" | cut -d '.' -f2)
    local patch=$(echo "$version" | cut -d '.' -f3)
    echo "$(( major * 10000 + minor * 1000 + patch ))"
}

convert_num_to_ver() {
    local version=$1
    local major=$(( $1 / 10000 ))
    local minor=$(( $1 / 1000 % 10 ))
    local patch=$(( $1 % 100 ))
    echo "$major.$minor.$patch"
}

# Use grep to extract the version code
version_code=$(grep -Ezo '<key>CFBundleShortVersionString<\/key>\n\s+<string>(.*?)<\/string>' $file_path | grep -Eo '<string>.*?</string>' | sed -E 's/<string>//' | sed -E 's/<\/string>//')

# Get Last
new_version_code=$(convert_ver_to_num $version_code)
new_version_code=$((new_version_code + 1))
new_version_code=$(convert_num_to_ver $new_version_code)

sed -i '' "s/${version_code}/${new_version_code}/g" $file_path

echo "Replacement successful."

