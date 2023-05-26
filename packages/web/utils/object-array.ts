import { isArray, isFunction, isObject, isPlainObject } from './is';

	
function hasKey(object, key) {
	return Object.prototype.hasOwnProperty.call(object, key);
}
// 把source对象中的内容深度赋给target, 数组合并
function mergeDeepConcatArray() {
	var source = [];
	for (var _i = 0; _i < arguments.length; _i++) {
			source[_i] = arguments[_i];
	}
	var result = {};
	var k = 0;
	while (k < source.length) {
			result = _mergeDeepMergeArray(result, source[k++]);
	}
	return result;
}
// 递归赋值
function _mergeDeepMergeArray(target, source) {
	var result = __assign({}, target);
	for (var key in source) {
			if (hasKey(source, key) && source[key] !== undefined) {
					if (isObject(source[key]) && isPlainObject(source[key])) {
							result[key] = _mergeDeepMergeArray(isObject(target[key]) ? target[key] : {}, source[key]);
					}
					else if (isArray(source[key]) && isArray(target[key])) {
							result[key] = _mergeDeepArray(target[key], source[key]);
					}
					else {
							result[key] = source[key];
					}
			}
	}
	return result;
}
function _mergeDeepArray(target, source) {
	var _target = isArray(target) ? target : [];
	var _source = isArray(source) ? source : [];
	return Array.prototype.concat.call(_target, _source).map(function (v) {
			if (v instanceof RegExp) {
					return v;
			}
			else if (isObject(v) && isPlainObject(v)) {
					return _mergeDeepMergeArray({}, v);
			}
			else if (isArray(v)) {
					return _mergeDeepArray([], v);
			}
			else {
					return v;
			}
	});
}
// 检查数组中是否有元素
function arrayIncludes(array, value) {
	if (!isArray(array)) {
			return false;
	}
	if (array.length === 0) {
			return false;
	}
	var k = 0;
	while (k < array.length) {
			if (array[k] === value) {
					return true;
			}
			k++;
	}
	return false;
}
var arrayRemove = function (arr, e) {
	if (!isArray(arr)) {
			return arr;
	}
	var i = arr.indexOf(e);
	if (i >= 0) {
			var arr_ = arr.slice();
			arr_.splice(i, 1);
			return arr_;
	}
	return arr;
};
/**
* 按路径访问对象属性
* @param target 待访问对象
* @param property 访问属性路径
* @param { (target: any, property: string): any } visitor 访问器
*/
var safeVisit = function (target, path, visitor) {
	var _a, _b;
	var paths = path.split('.');
	var _c = __read(paths), method = _c[0], rest = _c.slice(1);
	while (target && rest.length > 0) {
			target = target[method];
			_a = rest, _b = __read(_a), method = _b[0], rest = _b.slice(1);
	}
	if (!target) {
			return undefined;
	}
	return visitor(target, method);
};
/**
*  按路径调用函数
* @param target 待调用对象，如 `client`
* @param methods 待调用方法路径，可能是一级路径 `client.start`, 或者是多级命令 `client.context.set`
* @param args 调用参数
*/
var safeCall = function (target, method, args) {
	return safeVisit(target, method, function (obj, property) {
			if (obj && property in obj && isFunction(obj[property])) {
					try {
							return obj[property].apply(obj, args);
					}
					catch (err) {
							// ignore
							return undefined;
					}
			}
	});
};
var applyRecord = function () {
	var record = {};
	var set = function (key, val) { return (record[key] = val); };
	var del = function (key) { return delete record[key]; };
	return [record, set, del];
};
var pick = function (obj, keys) {
	if (!obj || !isObject(obj))
			return obj;
	return keys.reduce(function (prev, cur) {
			prev[cur] = obj[cur];
			return prev;
	}, {});
};
