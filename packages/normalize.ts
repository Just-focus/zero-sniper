function normalizeInitConfig(config) {
	var plugins = config.plugins || {};
	for (var k in plugins) {
			if (plugins[k] && !isObject(plugins[k])) {
					plugins[k] = {};
			}
	}
	return __assign(__assign({}, config), { plugins: plugins });
}
function validateInitConfig(config) {
	return isObject(config) && 'aid' in config;
}
function normalizeUserConfig(config) {
	return __assign({}, config);
}
function parseServerConfig(serverConfig) {
	if (!serverConfig) {
			return {};
	}
	var sample = serverConfig.sample, timestamp = serverConfig.timestamp, status = serverConfig.status;
	if (!sample) {
			return {};
	}
	var sample_rate = sample.sample_rate, sample_granularity = sample.sample_granularity, include_users = sample.include_users, rules = sample.rules;
	return {
			sample: {
					include_users: include_users,
					sample_rate: status && status === 4 ? 0 : sample_rate,
					sample_granularity: sample_granularity,
					rules: rules.reduce(function (prev, cur) {
							var name = cur.name, enable = cur.enable, sample_rate = cur.sample_rate, conditional_sample_rules = cur.conditional_sample_rules;
							prev[name] = {
									enable: enable,
									sample_rate: sample_rate,
									conditional_sample_rules: conditional_sample_rules,
							};
							return prev;
					}, {}),
			},
			serverTimestamp: timestamp,
	};
}
