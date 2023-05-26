	
var SAMPLED = '01';
var DEFAULT_TRACE_CONFIG = {
    sampleRate: 1,
    origins: [],
};
var uuid4 = function () {
    var crypto = window.crypto || window.msCrypto;
    if (crypto !== void 0 && crypto.getRandomValues) {
        var arr = new Uint16Array(8);
        crypto.getRandomValues(arr);
        var pad = function (num) {
            var v = num.toString(16);
            while (v.length < 4) {
                v = "0" + v;
            }
            return v;
        };
        return pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]);
    }
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        var r = (Math.random() * 16) | 0;
        return r.toString(16);
    });
};
var setVolTraceContext = function (traceConfig, tracestate) {
    var config = getConfig(traceConfig, DEFAULT_TRACE_CONFIG);
    if (!config)
        return;
    var sampled = isHitBySampleRate(config.sampleRate);
    if (!sampled)
        return;
    return function (url, cb) {
        var origins = config.origins;
        if (origins.length && Boolean(url.match(new RegExp(origins.join('|'))))) {
            cb('x-rum-traceparent', "00-" + uuid4() + "-" + uuid4().substring(16) + "-" + SAMPLED);
            cb('x-rum-tracestate', tracestate);
        }
    };
};
