import { browserBuilder } from './builder';
import { createBrowserConfigManager } from './config';
import { DEFAULT_IGNORE_PATHS, DEFAULT_SAMPLE_CONFIG, REPORT_DOMAIN, DEFAULT_SENDER_SIZE } from './constants';
import { normalizeInitConfig, normalizeUserConfig, validateInitConfig } from './normalize';
import { InjectQueryPlugin, InjectEnvPlugin, PrecollectPlugin, TimeCalibrationPlugin, InjectConfigPlugin, } from './plugins';
import { getDefaultSessionId, getReportUrl, getViewId, getStoreInfo } from './util';

var getDefaultConfig = function (c) {
	var storageInfo = getStoreInfo(c.aid);
	return {
			aid: 0,
			pid: '',
			token: '',
			viewId: getViewId('_'),
			userId: storageInfo.userId,
			deviceId: storageInfo.deviceId,
			sessionId: getDefaultSessionId(),
			domain: REPORT_DOMAIN,
			plugins: {
					ajax: { ignoreUrls: DEFAULT_IGNORE_PATHS },
					fetch: { ignoreUrls: DEFAULT_IGNORE_PATHS },
					breadcrumb: {},
					pageview: {},
					jsError: {},
					resource: {},
					resourceError: {},
					performance: {},
					tti: {},
					fmp: {},
					blankScreen: false,
			},
			release: '',
			env: 'production',
			sample: __assign(__assign({}, DEFAULT_SAMPLE_CONFIG), { r: storageInfo.r }),
			transport: getXhrTransport(),
	};
};
var createMinimalBrowserClient = function (_a) {
	var _b = _a === void 0 ? {} : _a, _c = _b.createSender, createSender = _c === void 0 ? function (config) {
			return createBrowserSender({
					size: DEFAULT_SENDER_SIZE,
					endpoint: getReportUrl(config.domain),
					transport: config.transport,
			});
	} : _c, _d = _b.builder, builder = _d === void 0 ? browserBuilder : _d, _e = _b.createDefaultConfig, createDefaultConfig = _e === void 0 ? getDefaultConfig : _e;
	var client = createClient({
			validateInitConfig: validateInitConfig,
			initConfigNormalizer: normalizeInitConfig,
			userConfigNormalizer: normalizeUserConfig,
			createSender: createSender,
			builder: builder,
			createDefaultConfig: createDefaultConfig,
			createConfigManager: createBrowserConfigManager,
	});
	ContextPlugin(client);
	TimeCalibrationPlugin(client);
	InjectConfigPlugin(client);
	InjectEnvPlugin(client);
	InjectNetworkTypePlugin(client);
	InjectQueryPlugin(client);
	var commandClient = withCommandArray(client, captureCurrentContext, function (c, ctx, args) {
			return syncReportWithCapturedContext(c, ctx)(function () {
					var _a = __read(args), method = _a[0], others = _a.slice(1);
					client[method].apply(client, __spreadArray([], __read(others), false));
			});
	});
	// add plugin after with commnand array
	IntegrationPlugin(commandClient);
	return commandClient;
};
var createBrowserClient = function (config) {
	if (config === void 0) { config = {}; }
	var client = createMinimalBrowserClient(config);
	SamplePlugin(client);
	PrecollectPlugin(client);
	CustomPlugin(client);
	// bundled collectors
	PageviewMonitorPlugin(client);
	AjaxMonitorVolPlugin(client);
	FetchMonitorVolPlugin(client);
	TTIMonitorPlugin(client);
	FMPMonitorPlugin(client);
	BreadcrumbMonitorPlugin(client);
	JsErrorMonitorPlugin(client);
	PerformanceMonitorPlugin(client);
	ResourceErrorMonitorPlugin(client);
	ResourceMonitorPlugin(client);
	BlankScreenMonitorVolPlugin(client);
	return client;
};
