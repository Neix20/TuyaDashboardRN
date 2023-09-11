import React from "react";

import { View } from "native-base";

function Index(props) {
    const { children, backgroundColor = "#fff", opacity = 0.5 } = props;
    return (
        <View>
            {/* Front Layer */}
            <View style={{
                position: "absolute",
                zIndex: 10,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }} 
            backgroundColor={backgroundColor} 
            opacity={opacity} />
            <View>
                {children}
            </View>
        </View>
    );
}


export default Index;