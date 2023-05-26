	
var addConfigToReportEvent = function (ev, config) {
	var extra = {};
	extra.aid = config.aid;
	extra.pid = config.pid;
	extra.view_id = config.viewId;
	extra.user_id = config.userId;
	return __assign(__assign({}, ev), { extra: __assign(__assign({}, extra), (ev.extra || {})) });
};

var InjectConfigPlugin = function (client) {
	client.on('beforeBuild', function (ev) {
			return addConfigToReportEvent(ev, client.config());
	});
};
