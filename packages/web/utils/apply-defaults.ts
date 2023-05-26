import { reportSelfError } from './registry';

var applyMutationObserver = function (MutationObserver, callback) {
	// eslint-disable-next-line compat/compat
	var observer = MutationObserver && new MutationObserver(callback);
	var observe = function (target, options) {
			observer && target && observer.observe(target, options);
	};
	var disconnect = function () { return observer && observer.disconnect(); };
	return [observe, disconnect];
};
var applyAnimationFrame = function (document, originRAF, originCAF, force) {
	var requestAnimationFrame = 
	// eslint-disable-next-line compat/compat
	!isFunction(originRAF) || (force && document && document.hidden)
			? function (cb) {
					cb(0);
					return 0;
			}
			: originRAF;
	var cancelAnimationFrame = isFunction(originCAF) ? originCAF : noop;
	/**
	 * 以 animationFrame 调用函数，如果一帧内多次调用，则会取消前面的调用
	 */
	var af;
	var scheduleAnimationFrame = function (cb) {
			af && cancelAnimationFrame(af);
			af = requestAnimationFrame(cb);
	};
	return [scheduleAnimationFrame, requestAnimationFrame, cancelAnimationFrame];
};
var applyPerformance = function (performance) {
	// eslint-disable-next-line compat/compat
	var timing = (performance && performance.timing) || undefined;
	var now = function () {
			if (performance && performance.now)
					return performance.now();
			var time = Date.now ? Date.now() : +new Date();
			var start = (timing && timing.navigationStart) || 0;
			return time - start;
	};
	var getEntriesByType = function (type) {
			var getEntriesByType = (performance || {}).getEntriesByType;
			return (isFunction(getEntriesByType) && getEntriesByType.call(performance, type)) || [];
	};
	var getEntriesByName = function (name) {
			var getEntriesByName = (performance || {}).getEntriesByName;
			return (isFunction(getEntriesByName) && getEntriesByName.call(performance, name)) || [];
	};
	var clearResourceTiming = function () {
			var clearResourceTimings = (performance || {}).clearResourceTimings;
			isFunction(clearResourceTimings) && clearResourceTimings.call(performance);
	};
	return [timing, now, getEntriesByType, clearResourceTiming, getEntriesByName];
};
var applyPerformanceObserver = function (PerformanceObserver, callback, once, onFail) {
	var observer = PerformanceObserver &&
			// eslint-disable-next-line compat/compat
			new PerformanceObserver(function (list, ob) {
					if (list.getEntries) {
							list.getEntries().forEach(function (val, i, arr) { return callback(val, i, arr, ob); });
					}
					else {
							onFail && onFail();
					}
					once && ob.disconnect();
			});
	var observe = function () {
			var types = [];
			for (var _i = 0; _i < arguments.length; _i++) {
					types[_i] = arguments[_i];
			}
			if (!PerformanceObserver || !observer)
					return onFail && onFail();
			try {
					types.forEach(function (type) {
							if (PerformanceObserver.supportedEntryTypes.indexOf(type) > -1) {
									observer.observe({ type: type, buffered: false });
							}
					});
			}
			catch (_a) {
					try {
							observer.observe({ entryTypes: types });
					}
					catch (_b) {
							return onFail && onFail();
					}
			}
	};
	var disconnect = function () { return observer && observer.disconnect(); };
	return [observe, disconnect];
};
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
var applyMonitor = function (monitorCtor, props, cb, deps) {
	if (props === void 0) { props = {}; }
	if (deps === void 0) { deps = []; }
	try {
			var monitor = monitorCtor.apply(void 0, __spreadArray([], __read(deps), false));
			return (monitor && monitor(props, cb)) || [];
	}
	catch (e) {
			reportSelfError(e);
			return [];
	}
};
