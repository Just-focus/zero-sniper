import { AjaxMonitor } from '../../monitors/ajax';
import { setTraceContext, setVolTraceContext } from '../../monitors/ajax/trace';
import { applyMonitor, getLocationUrl } from '../../utils';
import { getPluginConfig } from './utils';

var AJAX_MONITOR_PLUGIN_NAME = 'ajax';
var defaultConfig$8 = {
    autoWrap: true,
    hookCbAtReq: id,
    ignoreUrls: [],
    collectBodyOnError: false,
};
var getCbHook = function (client) { return function (cb) {
    if (!cb)
        return cb;
    var clientConfig = client.config();
    var common = {
        url: getLocationUrl(),
        pid: clientConfig.pid,
        view_id: clientConfig.viewId,
    };
    return function (ev) {
        cb(__assign(__assign({}, ev), { overrides: __assign(__assign({}, common), { timestamp: ev.payload.request.timestamp }) }));
    };
}; };
function AjaxMonitorVolPlugin(client) {
    client.on('init', function () {
        var _a;
        var config = getPluginConfig(client, AJAX_MONITOR_PLUGIN_NAME, defaultConfig$8);
        if (!config) {
            return;
        }
        var tearDownFlag = false;
        var tearDown = function () {
            tearDownFlag = true;
        };
        var cb = function (ev) { return !tearDownFlag && client.report(ev); };
        var _b = __read(applyMonitor(AjaxMonitor, __assign(__assign({}, config), { hookCbAtReq: getCbHook(client), setTraceHeader: setVolTraceContext(config.trace, "app_id=" + ((_a = client.config()) === null || _a === void 0 ? void 0 : _a.aid) + ",origin=web") }), cb), 1), wrapXhr = _b[0];
        client.on('beforeDestroy', tearDown);
        client.provide('wrapXhr', wrapXhr);
    });
}
