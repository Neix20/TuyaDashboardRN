#!/bin/bash

FILE_HEADER=${1:-"./"}

IOS_PATH="$FILE_HEADER""ios/YatuDashboard/Info.plist"
RN_CONST_PATH="$FILE_HEADER""app/config/clsConst.js"

#region Utilities
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
#endregion

# Use grep to extract the version code
ios_version_code=$(grep -Ezo '<key>CFBundleShortVersionString<\/key>\n\s+<string>(.*?)<\/string>' $IOS_PATH | grep -Eo '<string>.*?</string>' | sed -E 's/<string>//' | sed -E 's/<\/string>//')

# Get Last
new_ios_version_code=$(convert_ver_to_num $ios_version_code)
new_ios_version_code=$((new_ios_version_code + 1))
new_ios_version_code=$(convert_num_to_ver $new_ios_version_code)

sed -i '' "s/${ios_version_code}/${new_ios_version_code}/g" $IOS_PATH

echo "Replacement successful for $IOS_PATH"

sed -i '' "s/${ios_version_code}/${new_ios_version_code}/g" $RN_CONST_PATH

echo "Replacement successful for $RN_CONST_PATH"

