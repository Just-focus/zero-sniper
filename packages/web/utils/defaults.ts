function getDefaultBrowser() {
	if (typeof window === 'object' && isObject(window))
			return window;
}
function getDefaultDocument() {
	if (typeof document === 'object' && isObject(document))
			return document;
}
function getDefaultLocation() {
	return getDefaultBrowser() && window.location;
}
function getDefaultHistory() {
	// eslint-disable-next-line compat/compat
	return getDefaultBrowser() && window.history;
}
function getDefaultPerformance() {
	if (getDefaultBrowser() && isObject(window.performance))
			return window.performance;
}
function getDefaultPromise() {
	if (getDefaultBrowser() && 'Promise' in window)
			return Promise;
}
function getDefaultXMLHttpRequest() {
	if (typeof XMLHttpRequest === 'function' && isFunction(XMLHttpRequest))
			return XMLHttpRequest;
}
function getDefaultFetch() {
	try {
			// eslint-disable-next-line compat/compat
			new Headers();
			// eslint-disable-next-line compat/compat
			new Request('');
			// eslint-disable-next-line compat/compat
			new Response();
			// eslint-disable-next-line compat/compat
			return window.fetch;
	}
	catch (_a) {
			//
	}
}
function getDefaultMutationObserver() {
	if (getDefaultBrowser() && isFunction(window.MutationObserver))
			return window.MutationObserver;
}
function getDefaultPerformanceObserver() {
	if (getDefaultBrowser() && isFunction(window.PerformanceObserver))
			return window.PerformanceObserver;
}
function getDefaultPerformanceTiming() {
	var performance = getDefaultPerformance();
	if (performance && isObject(performance.timing))
			return performance.timing;
}
function getDefaultRaf() {
	if (getDefaultBrowser() && 'requestAnimationFrame' in window) {
			return window.requestAnimationFrame;
	}
}
function getDefaultCaf() {
	if (getDefaultBrowser() && 'cancelAnimationFrame' in window) {
			return window.cancelAnimationFrame;
	}
}
function getDefaultNavigator() {
	if (getDefaultBrowser() && 'navigator' in window) {
			return window.navigator;
	}
}
function getDefaultNetworkInformation() {
	var navigator = getDefaultNavigator();
	if (navigator) {
			return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	}
}
function getCurrentScript() {
	if (!document)
			return null;
	if (document.currentScript)
			return document.currentScript;
	// IE 8-10 support script readyState
	// IE 11+ support stack trace
	try {
			throw new Error();
	}
	catch (err) {
			// Find the second match for the "at" string to get file src url from stack.
			// Specifically works with the format of stack traces in IE.
			var i = 0;
			var stackDetails = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i.exec(err.stack);
			// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
			var scriptLocation = (stackDetails && stackDetails[2]) || false;
			// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
			var line = (stackDetails && stackDetails[3]) || 0;
			var currentLocation = document.location.href.replace(document.location.hash, '');
			var inlineScriptSource = '';
			var scripts = document.getElementsByTagName('script'); // Live NodeList collection
			if (scriptLocation === currentLocation) {
					var pageSource = document.documentElement.outerHTML;
					var inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
					inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
			}
			for (; i < scripts.length; i++) {
					// If ready state is interactive, return the script tag
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					if (scripts[i].readyState === 'interactive') {
							return scripts[i];
					}
					// If src matches, return the script tag
					if (scripts[i].src === scriptLocation) {
							return scripts[i];
					}
					// If inline source matches, return the script tag
					if (scriptLocation === currentLocation &&
							scripts[i].innerHTML &&
							scripts[i].innerHTML.trim() === inlineScriptSource) {
							return scripts[i];
					}
			}
			// If no match, return null
			return null;
	}
}
