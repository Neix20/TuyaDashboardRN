import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Index(props) {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const flag = height >= width;

    const smaller = height >= width ? width : height;
    const larger = height >= width ? height : width;

    // width, height, isPortrait, isLandscape
    return [width - insets.right, height, flag, !flag, smaller, larger];
}

export default Index;