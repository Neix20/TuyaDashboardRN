// import { Const } from "@config";

import { DateTime } from "luxon";

import { Platform } from 'react-native';

import { info, error } from "./logger";

import RNFS from "react-native-fs";

import RNFetchBlob from "rn-fetch-blob";

function genNgrokUrl(action) {
	// const { TEST_SERVER } = Const;
	// return `${TEST_SERVER}${action}`;
}

function genLogUrl(action) {
	// const { LOG_SERVER } = Const;
	// return `${LOG_SERVER}${action}`;
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

function requestObj(obj) {
	let res = { ...obj };
	return res;
}

function formatDt(dt, format = "yyyy-MM-dd") {
	let res = "";

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

		if (ind + 1 < arr.length) {
			tArr.push(arr[ind + 1]);
		}

		if (ind + 2 < arr.length) {
			tArr.push(arr[ind + 2]);
		}

		fArr.push(tArr);
	}
	return fArr;
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
			// console.log(`${file_name} Successfully Deleted!`);

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

export {
	genRandomInt,
	basename,
	extName,
	validatePhoneNum,
	requestObj,
}

export {
	genDt,
	genTs,
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
	genNgrokUrl,
	genLogUrl,
}

export {
	splitItemsIntoTwo,
	splitItemsIntoK
}

export {
	cacheDownloadFile,
	genBase64,
	formatArrWithBase64,
	roundDown,
	translate
}