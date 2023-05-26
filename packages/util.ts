import { BATCH_REPORT_PATH, SETTINGS_PATH, STORAGE_PREFIX, SDK_NAME } from './constants';

var getReportUrl = function (domain, path) {
	if (path === void 0) { path = BATCH_REPORT_PATH; }
	return "" + (domain && domain.indexOf('//') >= 0 ? '' : 'https://') + domain + path;
};
var getSettingsUrl = function (domain, path) {
	if (path === void 0) { path = SETTINGS_PATH; }
	return "" + (domain && domain.indexOf('//') >= 0 ? '' : 'https://') + domain + path;
};
var getViewId = function (pid) { return pid + "_" + Date.now(); };
var getDefaultSessionId = function () {
	return uuid();
};
var toObservableArray = function (arr) {
	var observers = [];
	arr.observe = function (o) {
			observers.push(o);
	};
	arr.push = function () {
			var _a;
			var vs = [];
			for (var _i = 0; _i < arguments.length; _i++) {
					vs[_i] = arguments[_i];
			}
			vs.forEach(function (v) {
					observers.forEach(function (o) { return o(v); });
			});
			return (_a = [].push).call.apply(_a, __spreadArray([arr], __read(vs), false));
	};
	return arr;
};
var getGlobalName = function () {
	var _a, _b, _c;
	var window = getDefaultBrowser();
	var document = getDefaultDocument();
	if (window && document) {
			return (((_c = (_b = (_a = getCurrentScript()) === null || _a === void 0 ? void 0 : _a.getAttribute('src')) === null || _b === void 0 ? void 0 : _b.match(/globalName=(.+)$/)) === null || _c === void 0 ? void 0 : _c[1]) || SDK_NAME);
	}
};
var getGlobalInstance = function () {
	var window = getDefaultBrowser();
	var globalName = getGlobalName();
	if (window && globalName) {
			return window[globalName];
	}
};
var getStorageKey = function (aid) { return STORAGE_PREFIX + aid; };
var getStoreInfo = function (aid) {
	var key = getStorageKey(aid);
	return (getStorageItem(key) || {
			userId: uuid(),
			deviceId: uuid(),
			r: Math.random(),
	});
};
var saveStoreInfo = function (config) {
	var aid = config.aid, userId = config.userId, deviceId = config.deviceId, sample = config.sample;
	var key = getStorageKey(aid);
	setStorageItem(key, {
			userId: userId,
			deviceId: deviceId,
			r: sample.r,
	});
};
