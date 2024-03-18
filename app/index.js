import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { SafeAreaProvider } from "react-native-safe-area-context";

// import App from "@screens";

import App from "@screensPro";
// import App from "@screensLite";
// import App from "@screensViewer";

import { persistor, store } from "@redux";

import { NativeBaseProvider } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';

import 'intl';
import 'intl/locale-data/jsonp/en';

function MasterApp() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <NativeBaseProvider>
                        <NavigationContainer>
                            <App />
                        </NavigationContainer>
                    </NativeBaseProvider>
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
};

export default MasterApp;
