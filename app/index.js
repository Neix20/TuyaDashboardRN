import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import App from "@screens";

import { persistor, store } from "@redux";

import { NativeBaseProvider } from 'native-base';

import { NavigationContainer } from '@react-navigation/native';

import 'intl';
import 'intl/locale-data/jsonp/en';

import CodePush from 'react-native-code-push';

const CodePushOptions = {
    checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
    mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
    updateDialog: {
        appendReleaseDescription: true,
        title: "New Update"
    }
};

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

export default CodePush(CodePushOptions)(MasterApp);
