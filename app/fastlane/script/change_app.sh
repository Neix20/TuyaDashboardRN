#!/bin/bash

line_num=9
file_path=$2

app_screen_arr=(
    "import App from \"@screensPro\";"
    "import App from \"@screensLite\";"
    "import App from \"@screensViewer\";"
)

prefix="\/\/"

# if [ $1 -eq 0 ]; then
#     app_screen_arr[1]="${prefix}${app_screen_arr[1]}"
#     app_screen_arr[2]="${prefix}${app_screen_arr[2]}"
# elif [ $1 -eq 1 ]; then
#     app_screen_arr[0]="${prefix}${app_screen_arr[0]}"
#     app_screen_arr[2]="${prefix}${app_screen_arr[2]}"
# elif [ $1 -eq 2 ]; then
#     app_screen_arr[0]="${prefix}${app_screen_arr[0]}"
#     app_screen_arr[1]="${prefix}${app_screen_arr[1]}"
# fi

for i in $(seq 0 2); do
    if [ "$1" -ne "$i" ]; then
        app_screen_arr[$i]="${prefix} ${app_screen_arr[$i]}"
    fi
done

# Replace line 9 with the replacement text
replacement_text="${app_screen_arr[0]}"
sed -i '' "$line_num"'s/.*/'"$replacement_text"'/' $file_path

replacement_text="${app_screen_arr[1]}"
sed -i '' "$((line_num + 1))"'s/.*/'"$replacement_text"'/' $file_path

replacement_text="${app_screen_arr[2]}"
sed -i '' "$((line_num + 2))"'s/.*/'"$replacement_text"'/' $file_path

echo "Replacement successful."