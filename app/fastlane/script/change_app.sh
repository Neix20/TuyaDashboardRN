#!/bin/bash

line_num=9

# APP_VARIANT=$1
# FILE_PATH=$2
APP_VARIANT=${1:-2}
FILE_HEADER=${2:-"./"}

app_screen_arr=(
    "import App from \"@screensPro\";"
    "import App from \"@screensLite\";"
    "import App from \"@screensViewer\";"
)

app_color_arr=(
    "#FB7304"
    "#2898FF"
    "#6334D3"
)

app_icon_arr=(
    "yatu_pro"
    "yatu_lite"
    "yatu_viewer"
)

prefix="\/\/"

# if [ $APP_VARIANT -eq 0 ]; then
#     app_screen_arr[1]="${prefix}${app_screen_arr[1]}"
#     app_screen_arr[2]="${prefix}${app_screen_arr[2]}"
# elif [ $APP_VARIANT -eq 1 ]; then
#     app_screen_arr[0]="${prefix}${app_screen_arr[0]}"
#     app_screen_arr[2]="${prefix}${app_screen_arr[2]}"
# elif [ $APP_VARIANT -eq 2 ]; then
#     app_screen_arr[0]="${prefix}${app_screen_arr[0]}"
#     app_screen_arr[1]="${prefix}${app_screen_arr[1]}"
# fi

for i in $(seq 0 2); do
    if [ "$APP_VARIANT" -ne "$i" ]; then
        app_screen_arr[$i]="${prefix} ${app_screen_arr[$i]}"
    fi
done

# Replace line 9 with the replacement text
FILE_PATH="$FILE_HEADER""app/index.js"

replacement_text="${app_screen_arr[0]}"
sed -i '' "$line_num""s/.*/$replacement_text/" $FILE_PATH

replacement_text="${app_screen_arr[1]}"
sed -i '' "$((line_num + 1))""s/.*/$replacement_text/" $FILE_PATH

replacement_text="${app_screen_arr[2]}"
sed -i '' "$((line_num + 2))""s/.*/$replacement_text/" $FILE_PATH

echo "Replacement successful for $FILE_PATH."

# Change Colors in clsConst
RN_CONST_PATH="$FILE_HEADER""app/config/clsConst.js"

line_num=$(grep -n "APP_COLOR" $RN_CONST_PATH | head -n 1 | cut -d ':' -f 1)
replacement_text="const APP_COLOR = \"${app_color_arr[APP_VARIANT]}\";"

sed -i '' "$line_num""s/.*/$replacement_text/" $RN_CONST_PATH

echo "Replacement successful for $RN_CONST_PATH."

# Replace Splash Screen Background Color
SPLASH_BG_PATH="$FILE_HEADER""android/app/src/main/res/values/colors.xml"

line_num=$(grep -n "bg_splash" $SPLASH_BG_PATH | head -n 1 | cut -d ':' -f 1)
replacement_text="<color name=\"bg_splash\">${app_color_arr[APP_VARIANT]}<\/color>"

sed -i '' "$line_num""s/.*/$replacement_text/" $SPLASH_BG_PATH

echo "Replacement successful for $SPLASH_BG_PATH."

# Replace Splash Icon
SPLASH_SCREEN_PATH="$FILE_HEADER""android/app/src/main/res/layout/launch_screen.xml"

line_num=$(grep -n "android:src" $SPLASH_SCREEN_PATH | head -n 1 | cut -d ':' -f 1)
replacement_text="android:src=\"@drawable\/${app_icon_arr[APP_VARIANT]}\""

sed -i '' "$line_num""s/.*/$replacement_text/" $SPLASH_SCREEN_PATH

echo "Replacement successful for $SPLASH_SCREEN_PATH."
