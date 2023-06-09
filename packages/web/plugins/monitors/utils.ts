import { getLocationUrl, getConfig } from '../../utils';

function getPluginConfig(client, pluginName, defaultConfig) {
	var _a;
	var c = (_a = client.config()) === null || _a === void 0 ? void 0 : _a.plugins[pluginName];
	return getConfig(c, defaultConfig);
}
	
var reportOnInitCommonParams = function (client, overrides) {
	var clientConfig = client.config();
	var common = {
			url: getLocationUrl(),
			pid: clientConfig.pid,
			view_id: clientConfig.viewId,
	};
	return function (ev) {
			client.report(__assign(__assign({}, ev), { overrides: __assign(__assign({}, common), ((overrides && overrides(ev)) || {})) }));
	};
};
