	
var browserBuilder = {
	build: function (e) {
			return {
					ev_type: e.ev_type,
					payload: e.payload,
					common: __assign(__assign({}, (e.extra || {})), (e.overrides || {})),
			};
	},
};
