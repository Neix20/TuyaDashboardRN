FILE_HEADER=${1:-"./app/"}

# Remove FastLane
FASTLANE_MD_PATH="$FILE_HEADER""fastlane/metadata"
rm -rf $FASTLANE_MD_PATH

# Download FastLane metadata
cd app
fastlane supply init
