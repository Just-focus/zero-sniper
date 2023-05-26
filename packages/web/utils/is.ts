export function isObject(o) {
	return typeof o === 'object' && o !== null;
}
export function isInstanceOf(wat, base) {
	try {
			return wat instanceof base;
	}
	catch (_e) {
			return false;
	}
}
var objProto = Object.prototype;
// https://stackoverflow.com/a/5878101
export function isPlainObject(o) {
	if (isObject(o)) {
			if (typeof Object.getPrototypeOf === 'function') {
					var proto = Object.getPrototypeOf(o);
					return proto === objProto || proto === null;
			}
			// cannot test, requires ES3
			/* istanbul ignore next */
			return objProto.toString.call(o) === '[object Object]';
	}
	return false;
}
export function isArray(o) {
	return objProto.toString.call(o) === '[object Array]';
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(o) {
	return typeof o === 'function';
}
export function isBoolean(o) {
	return typeof o === 'boolean';
}
export function isNumber(o) {
	return typeof o === 'number';
}
export function isString(o) {
	return typeof o === 'string';
}
export function isError(wat) {
	switch (Object.prototype.toString.call(wat)) {
			case '[object Error]':
					return true;
			case '[object Exception]':
					/* istanbul ignore next */
					return true;
			case '[object DOMError]':
					return true;
			case '[object DOMException]':
					/* istanbul ignore next */
					return true;
			default:
					/* istanbul ignore next */
					return wat instanceof Error;
	}
}
export function isEvent(wat) {
	return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}
export function isErrorEvent(what) {
	return Object.prototype.toString.call(what) === '[object ErrorEvent]';
}
export function isPromiseRejectionEvent(what) {
	return Object.prototype.toString.call(what) === '[object PromiseRejectionEvent]';
}
