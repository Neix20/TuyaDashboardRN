import { Svg } from "@config";

function Index(props) {

    // Get Default SVG Icon
    const dSvg = Object.keys(Svg)[0];
    const { name = dSvg, size = 12, color = "#000" } = props;

    // Make it into a Function
    const Icon = Svg[name];

    return (
        <Icon fill={color} {...props} />
    )
}

export default Index;