import { Svg } from "@config";

function Index(props) {

    // Get Default SVG Icon
    const dSvg = Object.keys(Svg)[0];
    const { name = dSvg } = props;

    // Make it into a Function
    const Icon = Svg[name];

    return (
        <Icon {...props} />
    )
}

export default Index;