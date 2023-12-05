import React from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Index(props) {

    const { defaultScreen = "Home", screens = {} } = props;
    const arr = Object.values(screens);

    const renderItem = ({ title, component, option = {} }, ind) => (
        <Stack.Screen key={ind}
            name={title} component={component}
            options={{ animation: 'slide_from_right', ...option }}
        />
    );

    return (
        <Stack.Navigator 
            initialRouteName={defaultScreen}
            screenOptions={{
                headerShown: false,
                swipeEdgeWidth: 0,
                gestureEnabled: false
            }}>
            {arr.map(renderItem)}
        </Stack.Navigator>
    );
}

export default Index;