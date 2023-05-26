import { getLocationUrl } from './url';

var captureCurrentContext = function (client) {
	var capturedContext = {
			url: getLocationUrl(),
			timestamp: Date.now(),
	};
	var config = client.config();
	if (config === null || config === void 0 ? void 0 : config.pid) {
			capturedContext.pid = config.pid;
	}
	if (client === null || client === void 0 ? void 0 : client['context']) {
			capturedContext.context = client['context'].toString();
	}
	return capturedContext;
};
// only works for sync report
// async report won't trigger 'report' immediately, es.g. sri
var syncReportWithCapturedContext = function (client, ctx) {
	return function (fn) {
			var inject = function (ev) {
					ev.overrides = ctx;
					return ev;
			};
			client.on('report', inject);
			fn();
			client.off('report', inject);
	};
};
