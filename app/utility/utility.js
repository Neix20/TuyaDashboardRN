import { clsConst } from "@config";

import { DateTime } from "luxon";

import { Platform, CameraRoll } from 'react-native';

import RNFS from "react-native-fs";

import RNFetchBlob from "rn-fetch-blob";

function genLogUrl(action) {
	const { LOG_URL } = clsConst;
	return `${LOG_URL}/${action}`;
}

function genServerUrl(action) {
	const { SERVER_URL } = clsConst;
	const res = `${SERVER_URL}/api/YatuApi/${action}`;
	return res;
}

function genDt() {
	const dt = DateTime.now();

	const t = dt.toFormat("yyyyMMdd");
	const t2 = dt.toFormat("hhmmss");

	return `${t}T${t2}`;
}

function getDiffSecond(date = "2000-08-18") {
	const today_dt = DateTime.now();

	const dt = DateTime.fromFormat(date, "yyyy-MM-dd");

	let res = dt.toSeconds() - today_dt.toSeconds();
	res = Math.floor(res);
	res = Math.max(0, res);
	return res;
}

function convertSecondsToDHMS(seconds) {
	const days = Math.floor(seconds / (24 * 3600));

	seconds = seconds % (24 * 3600);
	const hours = Math.floor(seconds / 3600);

	seconds = seconds % 3600;
	const minutes = Math.floor(seconds / 60);

	seconds = seconds % 60;

	return { days, hours, minutes, seconds };
}

function convertSecondsToDays(seconds) {
	let res = 0;
	res = Math.floor(seconds / (24 * 3600));
	res = res.toString().padStart(2, '0');
	return res;
}

function convertSecondsToHours(seconds) {
	let res = 0;
	res = Math.floor((seconds % (24 * 3600)) / 3600);
	res = res.toString().padStart(2, '0');
	return res;
}

function convertSecondsToMinutes(seconds) {
	let res = 0;
	res = Math.floor((seconds % 3600) / 60);
	res = res.toString().padStart(2, '0');
	return res;
}

function convertSecondsToSeconds(seconds) {
	let res = 0;
	res = seconds % 60;
	res = res.toString().padStart(2, '0');
	return res;
}

function genRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundDown(num, base = 1) {
	return Math.floor(num - num % base)
}

function genTs() {
	return DateTime.now().toMillis();
}

function basename(path) {
	return path.split(/[\\/]/).pop();
}

function extName(path) {
	return path.split(".").pop();
}

function validatePhoneNum(str) {

	if (str[0] === "6") {
		str = str.slice(1);
	}

	let rgx = /^\d{10,11}$/g;
	return rgx.test(str);
}

function validateEmail(str) {
	const rgx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return rgx.test(str);
}

function requestObj(obj) {
	let res = { ...obj };
	return res;
}

function formatDt(dt = "2023-01-01T00:00:00", format = "yyyy-MM-dd") {
	let res = "";

	if (dt == "" || dt == null || dt == undefined) {
		dt = "2023-01-01T00:00:00";
	}

	// Check if DateTime contains "T"
	if (!dt.includes("T")) {
		dt = dt.replace(/ /g, "T");
	}

	res = DateTime.fromISO(dt).toFormat(format);
	return res;
}

function formatWord(str) {
	let res = str;

	if (str.length > 16) {
		res = str.slice(0, 16) + "...";
	}

	return res;
}

// import * as langDict from "@config/lang";

function translate(key = "", lang = "en") {
	// let res = key;

	// const dict = langDict[lang] || {};

	// if (key in dict) {
	// 	res = dict[key];
	// }

	// return res;

	return key;
}

function splitItemsIntoTwo(arr) {
	let fArr = [];
	for (let ind = 0; ind < arr.length; ind += 2) {
		let tArr = [];

		tArr.push(arr[ind]);
		if (ind + 1 < arr.length) {
			tArr.push(arr[ind + 1]);
		}

		fArr.push(tArr);
	}
	return fArr;
}

function splitItemsIntoK(arr, col = 2) {
	let fArr = [];
	for (let ind = 0; ind < arr.length; ind += col) {
		let tArr = [];

		tArr.push(arr[ind]);

		for (let jnd = 1; jnd < col; jnd += 1) {
			if (ind + jnd < arr.length) {
				tArr.push(arr[ind + jnd]);
			}
		}

		fArr.push(tArr);
	}
	return fArr;
}

async function saveToGallery(uri) {
	try {
		if (Platform.OS === 'android') {
			// For Android, use the ContentResolver to add the image to the gallery
			await CameraRoll.save(uri, { type: 'photo' });
		} else {
			// For iOS, use the Photos framework to save the image to the gallery
			await CameraRoll.saveToCameraRoll(uri, 'photo');
		}
	}
	catch (err) {
		console.log(`Error: ${err}`);
	}
}

async function cacheDownloadFile(props) {
	const { url = "", folder_path = "", to_replace = false } = props;

	const file_name = basename(url);
	try {

		const cur_ts = genTs();

		// Check If File Exists
		const file_path = `${folder_path}/${file_name}`;

		let flag = await RNFS.exists(file_path);

		if (flag && to_replace) {
			await RNFS.unlink(file_path);
			flag = false;
		}

		let res = {
			file_name: file_name,
			path_name: `file://${file_path}?timestamp=${cur_ts}`,
			uri: { uri: `file://${file_path}?timestamp=${cur_ts}` },
		}

		if (flag) {
			// Return File URI
			// console.log(`${file_name} Already Exists!`);
		} else {
			// Download File
			const data = await RNFetchBlob.config({ fileCache: true }).fetch("GET", url + `?timestamp=${cur_ts}`, {});

			const tmp_file_path = data.path();

			// Read File To Get Base64
			const content = await RNFS.readFile(tmp_file_path, "base64");

			await RNFS.writeFile(file_path, content, 'base64');

			// console.log(`${file_name} Successfully Downloaded!`);
		}

		const content = await RNFS.readFile(file_path, "base64");
		res["base64"] = content;

		return res;
	}
	catch (err) {
		throw err;
	}
}

async function genBase64(file_path) {
	// file_path = file://...
	const res = await RNFS.readFile(file_path, "base64");
	return res;
}

async function formatArrWithBase64(ls) {
	let arr = [...ls];

	try {
		for (let ind in arr) {
			const { uri } = arr[ind];

			const base64_uri = uri.split("?")[0];
			const base64 = await genBase64(base64_uri);

			arr[ind] = {
				...arr[ind],
				base64: base64,
				data: base64,
				pos: ind,
				flag: false
			}
		}
	}
	catch (err) {
		throw err;
	}

	return arr;
}

function genLabel(start, end, data_point = 10) {
	const start_dt = DateTime.fromISO(start);
	const end_dt = DateTime.fromISO(end);

	let step = 1;
	let points = [];

	let interval = end_dt.diff(start_dt).as("hours");

	// if (false) {
	// 	interval = end_dt.diff(start_dt).as("minutes");

	// 	step = interval / (data_point - 1);
	// 	points = [];

	// 	for (let ind = 0; ind < data_point; ind++) {
	// 		const dt = start_dt.plus({ minutes: ind * step });

	// 		let point = dt.diff(start_dt).as("minutes");
	// 		point = Math.round(point);
	// 		point = point.toString().padStart(2, "0");

	// 		points.push(point);
	// 	}

	// 	// Print the generated points
	// 	return points;
	// }

	step = interval / (data_point - 1);
	points = [];

	for (let ind = 0; ind < data_point; ind++) {
		const dt = start_dt.plus({ hours: ind * step });

		let point = dt.diff(start_dt).as("hours");
		point = Math.round(point);
		point = point.toString().padStart(2, "0");

		points.push(point);
	}

	// Print the generated points
	return points;
}

function genTsLabel(start, end, data_point = 100, format = "hh:mma") {
	const start_dt = DateTime.fromISO(start);
	const end_dt = DateTime.fromISO(end);

	let points = [];

	const interval = end_dt.diff(start_dt).as("seconds");
	const step = interval / (data_point - 1);

	for (let ind = 0; ind < data_point; ind += 1) {
		const dt = start_dt.plus({ seconds: ind * step });

		const point = dt.toFormat(format);
		points.push(point);
	}

	return points;
}

function checkAppVersion(str) {
	const [a = 0, b = 0, c = 0] = str.split(".");

	const res = a * 10000 + b * 1000 + c;

	return res;
}

// import OneSignal from "react-native-onesignal";
import { OneSignal } from 'react-native-onesignal';

function OneSignalSubscribe(email) {
	// OneSignal.User.addEmail(email);
	OneSignal.login(email);
}

function genUnit(key) {
	let dict = {
		"Absolute Humidity": "%",
		"Temperature": "℃",
		"Relative Humidity": "%",
		"Temperature (℃)": "℃",
		"Relative Humidity (%)": "%",
		"Voltage": "V",
		"Power": "W",
		"Current": "mA",
		"Voltage (V)": "V",
		"Power (W)": "W",
		"Current (mA)": "mA",
		"Formaldehyde": "mg/m3",
		"Carbon Dioxide": "ppm",
		"Particle Matter": "ug/m3",
		"Formaldehyde (mg/m3)": "mg/m3",
		"Carbon Dioxide (ppm)": "ppm",
		"Particle Matter (ug/m3)": "ug/m3",
		"Formaldehyde (CH2O)": "mg/m3",
		"Carbon Dioxide (CO2)": "ppm",
		"Particle Matter (PM2.5)": "ug/m3",
		"KWh": "KWh",
		"Total KiloWatt": "KWh",
		"Total KiloWatt (KWh)": "KWh",
	}

	if (key in dict) {
		return " " + dict[key]
	}

	return "";
}

function getServiceId() {

	const { OS = "" } = Platform;

	if (OS === "android") {
		return 4001;
	}

	if (OS === "ios") {
		return 4002;
	}

	return 4001;
}

function colorHue(hex, percent = 0.8) {
	// Parse the hex color string to RGB
	let r = parseInt(hex.substring(1, 3), 16);
	let g = parseInt(hex.substring(3, 5), 16);
	let b = parseInt(hex.substring(5, 7), 16);

	// Adjust the RGB values to lighten the color
	r = Math.floor(r * (1 + percent));
	g = Math.floor(g * (1 + percent));
	b = Math.floor(b * (1 + percent));

	// Ensure the values are within the valid range
	r = r > 255 ? 255 : r;
	g = g > 255 ? 255 : g;
	b = b > 255 ? 255 : b;

	// Convert the RGB values back to a hexadecimal color
	const newHex = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
	return newHex;
}

function colorOpacity(hex, opacity = 0.8) {
	// Parse the hex color string to RGB
	let r = parseInt(hex.substring(1, 3), 16);
	let g = parseInt(hex.substring(3, 5), 16);
	let b = parseInt(hex.substring(5, 7), 16);

	// Return the color in rgba format with the specified opacity
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export {
	checkAppVersion,
	OneSignalSubscribe
}

export {
	genRandomInt,
	basename,
	extName,
	requestObj,
}

export {
	validatePhoneNum,
	validateEmail
}

export {
	genDt,
	genTs,
	genLabel,
	genTsLabel,
	genUnit,
	getServiceId
}

export {
	getDiffSecond,
	convertSecondsToDHMS,
	convertSecondsToDays,
	convertSecondsToHours,
	convertSecondsToMinutes,
	convertSecondsToSeconds,
}

export {
	formatDt,
	formatWord,
}

export {
	genLogUrl,
	genServerUrl
}

export {
	splitItemsIntoTwo,
	splitItemsIntoK
}

export {
	cacheDownloadFile,
	saveToGallery,
	genBase64,
	formatArrWithBase64,
	roundDown,
	translate
}

export {
	colorHue,
	colorOpacity
}