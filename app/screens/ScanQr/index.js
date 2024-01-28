import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image, TextInput, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import { Logger, Utility } from "@utility";
import { Images, Svg } from "@config";

import QRCodeScanner from 'react-native-qrcode-scanner';
import { BcHeader, BcYesNoModal } from "@components";

function QrCodeScan(props) {
    const { onRead = () => { } } = props;

    return (
        <QRCodeScanner
            reactivate={true}
            onRead={onRead}
            containerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#000',
            }}
            topViewStyle={{ flex: 0 }}
            bottomViewStyle={{ flex: 0 }}
            cameraStyle={{ overflow: 'hidden' }}
            showMarker={true}
        />
    );
}

function Index(props) {

    const toast = useToast();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const readQrCode = (e) => {
        try {
            if (e.data.length > 0) {
                const qrData = JSON.parse(e.data);
                navigation.navigate("DeviceResult", qrData);
            }
        } catch (error) {
            
        }
    }

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>

                    {/* Header */}
                    <BcHeader>Scan QR</BcHeader>

                    <View style={{ height: 10 }} />

                    {/* Body */}
                    <QrCodeScan onRead={readQrCode} />

                </View>
            </SafeAreaView>
        </>
    );
}

export default Index;