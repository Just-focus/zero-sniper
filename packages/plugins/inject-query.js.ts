import { SDK_NAME, SDK_VERSION } from '../constants';
	
var InjectQueryPlugin = function (client) {
	client.on('start', function () {
			var _a = client.config(), deviceId = _a.deviceId, sessionId = _a.sessionId, release = _a.release, env = _a.env, offset = _a.offset, aid = _a.aid, token = _a.token;
			var query = {
					did: deviceId,
					sid: sessionId,
					release: release,
					env: env,
					sname: SDK_NAME,
					sversion: SDK_VERSION,
					soffset: offset || 0,
					biz_id: aid,
					x_auth_token: token,
			};
			var sender = client.getSender();
			sender.setEndpoint(sender.getEndpoint() + joinQueryWithMap(query));
	});
};
