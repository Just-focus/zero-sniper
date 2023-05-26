import { getDefaultBrowser } from './defaults';

// 获取全局注册表
var getGlobalRegistry = function (global) {
	if (!global)
			return;
	if (!global.__SLARDAR_REGISTRY__) {
			global.__SLARDAR_REGISTRY__ = {
					Slardar: {
							plugins: [],
							errors: [],
					},
			};
	}
	return global.__SLARDAR_REGISTRY__.Slardar;
};
var reportSelfError = function () {
	var errorInfo = [];
	for (var _i = 0; _i < arguments.length; _i++) {
			errorInfo[_i] = arguments[_i];
	}
	var registry = getGlobalRegistry(getDefaultBrowser());
	if (!registry)
			return;
	if (!registry.errors) {
			registry.errors = [];
	}
	registry.errors.push(errorInfo);
};
