	
var EV_METHOD_MAP = {
	sri: 'reportSri',
	st: 'reportResourceError',
	err: 'captureException',
};
var createStore = function (evMap) {
	return Object.keys(evMap).reduce(function (prev, cur) {
			prev[cur] = [];
			return prev;
	}, {});
};
var reverseMap = function (map) {
	return Object.keys(map).reduce(function (prev, cur) {
			prev[map[cur]] = cur;
			return prev;
	}, {});
};
var getStoreOrConsume = function (client, store, evMap) {
	return function (type, data, timestamp, url) {
			var _a;
			if (timestamp === void 0) { timestamp = Date.now(); }
			if (url === void 0) { url = location.href; }
			var capturedContext = __assign(__assign({}, captureCurrentContext(client)), { url: url, timestamp: timestamp });
			if (store[type]) {
					if (client[evMap[type]]) {
							syncReportWithCapturedContext(client, capturedContext)(function () {
									client[evMap[type]](data);
							});
					}
					else {
							(_a = store[type]) === null || _a === void 0 ? void 0 : _a.push([data, capturedContext]);
					}
			}
	};
};
var getConsumeStored = function (client, store, evMethods) { return function (name) {
	var _a;
	if (name in evMethods) {
			(_a = store[evMethods[name]]) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
					var _b = __read(_a, 2), event = _b[0], capturedContext = _b[1];
					syncReportWithCapturedContext(client, capturedContext)(function () {
							client[name](event);
					});
			});
			// 置空，不再消费
			store[evMethods[name]] = null;
	}
}; };
// 只有 staticError, jsError, unhandledreject, sri 会被预收集
var PrecollectPlugin = function (client, evMap) {
	var _a;
	if (evMap === void 0) { evMap = EV_METHOD_MAP; }
	var store = createStore(evMap);
	var evMethods = reverseMap(evMap);
	var storeOrConsume = getStoreOrConsume(client, store, evMap);
	// 继续消费后续预收集数据
	if (((_a = client.p) === null || _a === void 0 ? void 0 : _a.a) && 'observe' in client.p.a) {
			// 注册预收集消费回调
			client.p.a.observe(function (_a) {
					var _b = __read(_a, 5); _b[0]; var type = _b[1], data = _b[2], timestamp = _b[3], url = _b[4];
					storeOrConsume(type, data, timestamp, url);
			});
	}
	client.on('init', function () {
			var _a;
			// 消费已经收集的预收集数据
			(_a = client.p) === null || _a === void 0 ? void 0 : _a.a.forEach(function (_a) {
					var _b = __read(_a, 5); _b[0]; var type = _b[1], data = _b[2], timestamp = _b[3], url = _b[4];
					storeOrConsume(type, data, timestamp, url);
			});
			// 由于已经消费，置空所有预收集的数据
			// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
			client.p && client.p.a && (client.p.a.length = 0);
	});
	// 消费预收集并通知其他实例
	client.provide('precollect', storeOrConsume);
	// consume stored data when provided
	client.on('provide', getConsumeStored(client, store, evMethods));
};
