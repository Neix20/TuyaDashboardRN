#!/bin/bash

ANDROID_PATH=$1

# Use grep to extract the version code
android_version_code=$(grep -Eo "versionCode [0-9]+" $ANDROID_PATH | sed -E 's/versionCode //' | head -n 1)

# Update New Version Code
new_android_version_code=$((android_version_code + 1))

sed -i '' "s/${android_version_code}/${new_android_version_code}/g" $ANDROID_PATH

echo "Replacement successful."