import React from "react";

import { View } from "native-base";

function Index(props) {
    const { children, backgroundColor = "#fff", opacity = 0.5, style = {} } = props;
    return (
        <View style={style}>
            {/* Front Layer */}
            <View position={"absolute"} 
                zIndex={2}
                bgColor={backgroundColor}
                opacity={opacity}
                style={{
                    top: 0, bottom: 0,
                    left: 0, right: 0
                }}
            />
            {children}
        </View>
    );
}


export default Index;