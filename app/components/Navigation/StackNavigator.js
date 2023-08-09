import React from "react";

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Index(props) {

    const { defaultScreen = "Home", StackScreens = {} } = props;

    const StackScreenArr = Object.values(StackScreens);

    return (
        <Stack.Navigator 
            initialRouteName={defaultScreen}
            screenOptions={{
                headerShown: false,
                swipeEdgeWidth: 0,
                gestureEnabled: false
            }}>
            {
                StackScreenArr.map((screen, ind) => {
                    const { title, component } = screen;
                    return (
                        <Stack.Screen 
                            key={ind}
                            name={title}
                            component={component}
                            options={{ animation: 'slide_from_right' }}
                        />
                    );
                })
            }
        </Stack.Navigator>
    );
}

export default Index;