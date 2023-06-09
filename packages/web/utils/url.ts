import { getDefaultBrowser, getDefaultDocument, getDefaultLocation } from './defaults';

	
function getFullUrl(url) {
	var document = getDefaultDocument();
	if (!document || !url)
			return '';
	var a = document.createElement('a');
	a.href = url;
	return a.href;
}
function parseUrl(url) {
	var document = getDefaultDocument();
	if (!document || !url) {
			return {
					url: url,
					protocol: '',
					domain: '',
					query: '',
					path: '',
					hash: '',
			};
	}
	var a = document.createElement('a');
	a.href = url;
	var path = a.pathname || '/';
	/* istanbul ignore next */
	if (path[0] !== '/') {
			path = '/' + path;
	}
	return {
			url: a.href,
			protocol: a.protocol.slice(0, -1),
			domain: a.hostname,
			query: a.search.substring(1),
			path: path,
			hash: a.hash,
	};
}
function getLocationUrl() {
	var location = getDefaultBrowser() && getDefaultLocation();
	return location === null || location === void 0 ? void 0 : location.href;
}
