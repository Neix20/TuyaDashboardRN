
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { View, VStack, HStack, useToast } from "native-base";

import { useNavigation, useIsFocused } from "@react-navigation/native";

import { Logger, Utility } from "@utility";
import { clsConst, Images } from "@config";

import { BaseIIModal } from "@components";

import { Platform, Linking } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

function Index(props) {

	const { showModal = false, setShowModal = () => { } } = props;
	const closeModal = () => setShowModal(false);

	// const { onPressYes = closeModal } = props;

	const style = {
		title: {
			fontWeight: "bold",
			fontSize: 18,
			color: "#000"
		},
		description: {
			fontFamily: "Roboto-Medium",
			fontSize: 14,
			color: "#000",
			textAlign: "justify",
		},
		instruction: {
			fontWeight: "500",
			fontSize: 14,
			color: "#000",
			textAlign: "justify",
		},
		hyperlink: {
			textDecorationLine: "underline",
			fontFamily: "Roboto-Medium",
			fontSize: 16,
			color: "#3366CC"
		},
		titleYes: {
			fontFamily: "Roboto-Bold",
			fontSize: 20,
			textAlign: "center",
			color: "#fff",
		},
		titleNo: {
			fontFamily: "Roboto-Bold",
			fontSize: 20,
			textAlign: "center",
			color: "#6A7683",
		}
	}

	const GoToYatuLiteStore = () => {
		const url = Platform.select({
			ios: "https://play.google.com/store/apps/details?id=com.yatudashboard.lite&hl=en&gl=US",
			android: "https://play.google.com/store/apps/details?id=com.yatudashboard.lite&hl=en&gl=US"
		})

		Linking.openURL(url);
	}

	return (
		<BaseIIModal {...props}>
			<VStack alignItems={"center"} space={3} py={0}>
				{/* Title */}
				<View alignItems={"center"} width={"90%"}>
					<Text style={style.title}>Error! New User Alert!</Text>
				</View>

				<FontAwesome name={"warning"} color={"#F00"} size={64} />

				<View width={"90%"}>
					<Text style={style.description}>
						It seems like you have not been registered as a Yatu User! Yatu Pro is only available for dedicated Yatu Lite User!
					</Text>
				</View>

				{/* Warning */}
				<TouchableOpacity onPress={GoToYatuLiteStore}>
					<VStack space={1}>
						<Text style={[style.instruction, { color: "#2898FF" }]}>Yatu Viewer</Text>
						<Image source={Images.YatuLiteLogo} resizeMode={"contain"} style={{ height: 80, width: 80, borderRadius: 20 }} />
					</VStack>
				</TouchableOpacity>

				{/* Description */}
				<VStack px={3} pt={2} space={3} width={"90%"}
					borderColor={"#000"} borderWidth={2}>
					{/* Title */}
					<Text style={[style.instruction, { fontWeight: "bold" }]}>Notice: </Text>

					<VStack space={2}>
						{/* Check Smart Life User */}
						<Text style={style.instruction}>1. Ensure that you are a registered Yatu Lite User</Text>

						{/* Ready a Computer to do Setup */}
						<Text style={style.instruction}>2. Yatu Pro is an enhancement from Yatu Lite, it is a subscription based premium app for Yatu Users to upgrade their iOT Experience</Text>
					</VStack>
				</VStack>

				{/* Yes / No */}
				{/* Button Panel */}
				<HStack space={3}>
					<TouchableOpacity onPress={closeModal}>
						<HStack borderRadius={8} bgColor={Utility.getColor()}
							alignItems={"center"} justifyContent={"center"}
							style={{ width: 120, height: 40 }}>
							<Text style={style.titleYes}>Confirm</Text>
						</HStack>
					</TouchableOpacity>
					<TouchableOpacity onPress={closeModal}>
						<HStack borderRadius={8} bgColor={"#E6E6E6"}
							alignItems={"center"} justifyContent={"center"}
							style={{ width: 120, height: 40 }}>
							<Text style={style.titleNo}>Cancel</Text>
						</HStack>
					</TouchableOpacity>
				</HStack>
			</VStack>
		</BaseIIModal>
	)
}

export default Index;