import { getDefaultBrowser, getDefaultDocument } from './defaults';

function onPageLoad(callback) {
	var window = getDefaultBrowser();
	var document = getDefaultDocument();
	if (!window || !document)
			return;
	if (document.readyState === 'complete') {
			callback();
			return;
	}
	window.addEventListener('load', function () {
			setTimeout(function () {
					callback();
			}, 0);
	}, false);
}
var invokeCallbackOnce = function (cb) {
	var hasInvoked = false;
	var invoke = function (params) {
			if (hasInvoked)
					return;
			hasInvoked = true;
			cb && cb(params);
	};
	return [invoke];
};
var onPageUnload = function (cb) {
	var _a = __read(invokeCallbackOnce(cb), 1), invokeCbOnce = _a[0];
	['unload', 'beforeunload', 'pagehide'].forEach(function (ev) {
			addEventListener(ev, invokeCbOnce);
	});
};
var onceHidden = function (cb, once) {
	if (once === void 0) { once = true; }
	if (document.visibilityState === 'hidden') {
			cb();
			return;
	}
	var onVisibilityChange = function () {
			if (document.visibilityState === 'hidden') {
					cb();
					once && removeEventListener('visibilitychange', onVisibilityChange, true);
			}
	};
	addEventListener('visibilitychange', onVisibilityChange, true);
};
var getConfig = function (c, defaultConfig) {
	if (isObject(c)) {
			return __assign(__assign({}, defaultConfig), c);
	}
	else {
			return c ? defaultConfig : false;
	}
};
