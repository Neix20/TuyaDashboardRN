import { useWindowDimensions } from "react-native";

function Index(props) {
    const { width, height } = useWindowDimensions();

    const flag = height >= width;

    const smaller = height >= width ? width : height;
    const larger = height >= width ? height : width;

    // width, height, isPortrait, isLandscape
    return [width, height, flag, !flag, smaller, larger];
}

export default Index;