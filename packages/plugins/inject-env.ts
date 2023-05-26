var addEnvToSendEvent = function (ev) {
	var extra = {
			url: getLocationUrl(),
			timestamp: Date.now(),
	};
	return __assign(__assign({}, ev), { extra: __assign(__assign({}, extra), (ev.extra || {})) });
};

var InjectEnvPlugin = function (client) {
	client.on('report', function (ev) {
			return addEnvToSendEvent(ev);
	});
};
