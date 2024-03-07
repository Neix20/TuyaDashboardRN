
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
			fontFamily: "Roboto-Bold",
			fontSize: 18,
			color: "#000"
		},

		instruction: {
			fontFamily: "Roboto-Bold",
			fontSize: 18
		},
		hyperlink: {
			textDecorationLine: "underline",
			fontFamily: "Roboto-Medium",
			fontSize: 18,
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

	const GoToShopee = () => {
		const url = Platform.select({
			ios: "https://play.google.com/store/apps/details?id=com.yatudashboard&hl=en&gl=US",
			android: "https://play.google.com/store/apps/details?id=com.yatudashboard&hl=en&gl=US"
		})

		Linking.openURL(url)
	}

	return (
		<BaseIIModal {...props}>
			<VStack alignItems={"center"} space={3}>
				{/* Title */}
				<View alignItems={"center"} width={"90%"}>
					<Text style={style.title}>Error! Not Existing Yatu Lite User!</Text>
				</View>

				{/* Warning */}
				<HStack space={3}>
					<FontAwesome name={"warning"} color={"#F00"} size={80} />
					<Image source={Images.YatuLiteLogo} resizeMode={"contain"} style={{ height: 80, width: 80, borderRadius: 20 }} />
				</HStack>

				{/* Description */}
				<VStack p={3} space={3} width={"90%"}
					borderColor={"#000"} borderWidth={2}>
					{/* Title */}
					<Text style={style.instruction}>Notice: </Text>

					<VStack space={2}>
						{/* Check Smart Life User */}
						<View>
							<Text style={style.instruction}>1. Ensure that you are a registered</Text>
							<TouchableOpacity onPress={GoToShopee}>
								<Text style={style.hyperlink}>Yatu Lite User</Text>
							</TouchableOpacity>
						</View>

						{/* Ready a Computer to do Setup */}
						<Text style={style.instruction}>2. This app is an enhancement from Yatu Lite! Please ensure that you have Yatu Lite installed first!</Text>
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