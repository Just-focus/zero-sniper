import { getEventParams, checkIsIgnored, getGetLatestEntryByName, isSensitiveHeader } from './util';

	
var hookSetHeader = function (setRequestHeader) {
	return function () {
			var setOptions = [];
			for (var _i = 0; _i < arguments.length; _i++) {
					setOptions[_i] = arguments[_i];
			}
			this._reqHeaders = this._reqHeaders || {};
			var _a = __read(setOptions, 2), name = _a[0], value = _a[1];
			!isSensitiveHeader(name, value) && (this._reqHeaders[name.toLowerCase()] = value);
			return setRequestHeader && setRequestHeader.apply(this, setOptions);
	};
};
var hookOnreadystatechange = function (xhr, getLatestEntryByName) {
	return hookMethodDangerously(xhr, 'onreadystatechange', function (origin, props, cb) {
			return function () {
					var ev = [];
					for (var _i = 0; _i < arguments.length; _i++) {
							ev[_i] = arguments[_i];
					}
					try {
							this.readyState === 4 &&
									!checkIsIgnored(props.ignoreUrls, xhr._url) &&
									cb &&
									cb({
											ev_type: 'http',
											payload: getEventParams(xhr, props, getLatestEntryByName),
									});
					}
					catch (e) {
							reportSelfError(e);
					}
					return origin && origin.apply(this, ev);
			};
	});
};
var hookSend = function (send, props, cb, getLatestEntryByName) {
	return function () {
			var _this = this;
			var sendOptions = [];
			for (var _i = 0; _i < arguments.length; _i++) {
					sendOptions[_i] = arguments[_i];
			}
			hookOnreadystatechange(this, getLatestEntryByName)(props, props.hookCbAtReq(cb));
			props.setTraceHeader &&
					props.setTraceHeader(this._url, function (key, value) { return _this.setRequestHeader(key, value); });
			this._start = Date.now();
			this._data = sendOptions === null || sendOptions === void 0 ? void 0 : sendOptions[0];
			return send.apply(this, sendOptions);
	};
};
var hookOpen = function (open) {
	return function () {
			var _a;
			var openOptions = [];
			for (var _i = 0; _i < arguments.length; _i++) {
					openOptions[_i] = arguments[_i];
			}
			_a = __read(openOptions, 2), this._method = _a[0], this._url = _a[1];
			return open.apply(this, openOptions);
	};
};
var hookXhrMethods = function (xhr, props, cb, getLatestEntryByName) {
	hookMethodDangerously(xhr, 'open', hookOpen)();
	hookMethodDangerously(xhr, 'setRequestHeader', hookSetHeader)();
	hookMethodDangerously(xhr, 'send', hookSend)(props, cb, getLatestEntryByName);
};
var hookXhr = function (Xhr, props, cb, getLatestEntryByName) {
	function Ctor() {
			var xhr = new Xhr();
			hookXhrMethods(xhr, props, cb, getLatestEntryByName);
			return xhr;
	}
	Ctor.prototype = new Xhr();
	['DONE', 'HEADERS_RECIEVED', 'LOADING', 'OPENED', 'UNSENT'].forEach(function (key) {
			Ctor[key] = Xhr[key];
	});
	return Ctor;
};
var AjaxMonitor = function (global, performance) {
	if (global === void 0) { global = getDefaultXMLHttpRequest() && getDefaultBrowser(); }
	if (performance === void 0) { performance = getDefaultPerformance(); }
	if (!global) {
			return;
	}
	var getLatestEntryByName = getGetLatestEntryByName(performance);
	return function (props, cb) {
			if (props.autoWrap) {
					var xhrProto = XMLHttpRequest && XMLHttpRequest.prototype;
					if (xhrProto) {
							hookXhrMethods(xhrProto, props, cb, getLatestEntryByName);
					}
			}
			var wrapXhr = function (xhr, p, c) {
					if (p === void 0) { p = props; }
					if (c === void 0) { c = cb; }
					return hookXhr(xhr, p, c, getLatestEntryByName);
			};
			return [wrapXhr];
	};
};
