export var getEventParams = function (xhr, props, getLatestEntryByName) {
	var _method = xhr._method, _reqHeaders = xhr._reqHeaders, _url = xhr._url, _start = xhr._start, _data = xhr._data;
	var fullUrl = getFullUrl(_url);
	var params = {
			api: 'xhr',
			request: {
					url: fullUrl,
					method: (_method || '').toLowerCase(),
					headers: _reqHeaders,
					timestamp: _start,
			},
			response: {
					status: xhr.status || 0,
					is_custom_error: false,
					timing: getLatestEntryByName(fullUrl),
					timestamp: Date.now(),
			},
			duration: Date.now() - _start,
	};
	if (typeof xhr.getAllResponseHeaders === 'function') {
			params.response.headers = formatXHRAllResponseHeaders(xhr.getAllResponseHeaders());
	}
	var status = params.response.status;
	var collectBodyOnError = props.collectBodyOnError, extraExtractor = props.extraExtractor;
	try {
			var extra = extraExtractor === null || extraExtractor === void 0 ? void 0 : extraExtractor(xhr.response, params);
			extra && (params.extra = extra);
			extra && (params.response.is_custom_error = true);
			// 非 2xx , 3xx 请求，上传request body
			if (collectBodyOnError && status >= 400) {
					params.request.body = _data ? "" + _data : undefined;
					params.response.body = xhr.response ? "" + xhr.response : undefined;
			}
	}
	catch (_o) {
			// do nothing
	}
	return params;
};
export var checkIsIgnored = function (ignoreUrls, url) {
	var ignoreRgx = getRegexp(ignoreUrls || []);
	return !!ignoreRgx && ignoreRgx.test(url);
};
export var getGetLatestEntryByName = function (performance) {
	var _a = __read(applyPerformance(performance), 5), getEntriesByName = _a[4];
	return function (name) {
			return getEntriesByName(name).pop();
	};
};

var headerKeyRe = new RegExp('(cookie|auth|jwt|token|key|ticket|secret|credential|session|password)', 'i');
var headerValueRe = new RegExp('(bearer|session)', 'i');
export var isSensitiveHeader = function (key, value) {
    if (!key || !value)
        return false;
    return headerKeyRe.test(key) || headerValueRe.test(value);
};
