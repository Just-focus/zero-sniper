var getStorageItem = function (name) {
	try {
			var value = localStorage.getItem(name);
			var ret = value;
			if (value && typeof value === 'string') {
					ret = JSON.parse(value);
			}
			return ret;
	}
	catch (_e) {
			return undefined;
	}
};
var setStorageItem = function (key, value) {
	try {
			var stringValue = typeof value === 'string' ? value : JSON.stringify(value);
			localStorage.setItem(key, stringValue);
	}
	catch (_o) {
			// do nothing
	}
};
