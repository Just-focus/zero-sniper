/**
 * from sentry https://github.com/getsentry/sentry-javascript/blob/5.30.0/packages/utils/src/browser.ts
 */
var UNKNOWN_PATH = '<unknown>';
/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function htmlTreeAsString(elem) {
    // try/catch both:
    // - accessing event.target (see getsentry/raven-js#838, #768)
    // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
    // - can throw an exception in some circumstances.
    try {
        var currentElem = elem;
        var MAX_TRAVERSE_HEIGHT = 5;
        var MAX_OUTPUT_LEN = 80;
        var out = [];
        var height = 0;
        var len = 0;
        var separator = ' > ';
        var sepLength = separator.length;
        var nextStr = void 0;
        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
            nextStr = _htmlElementAsString(currentElem);
            // bail out if
            // - nextStr is the 'html' element
            // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
            //   (ignore this limit if we are on the first iteration)
            if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)) {
                break;
            }
            out.push(nextStr);
            len += nextStr.length;
            currentElem = currentElem.parentNode;
        }
        return out.reverse().join(separator);
    }
    catch (_oO) {
        return UNKNOWN_PATH;
    }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function _htmlElementAsString(el) {
    var elem = el;
    var out = [];
    var classes;
    var key;
    var attr;
    var i;
    if (!elem || !elem.tagName) {
        return '';
    }
    out.push(elem.tagName.toLowerCase());
    if (elem.id) {
        out.push("#" + elem.id);
    }
    var className = elem.className;
    if (className && isString(className)) {
        classes = className.split(/\s+/);
        for (i = 0; i < classes.length; i++) {
            out.push("." + classes[i]);
        }
    }
    var attrlist = ['type', 'name', 'title', 'alt'];
    for (i = 0; i < attrlist.length; i++) {
        key = attrlist[i];
        attr = elem.getAttribute(key);
        if (attr) {
            out.push("[" + key + "=\"" + attr + "\"]");
        }
    }
    return out.join('');
}
var applyDomAndKeyPress = function (debounceDuration) {
    var keypressTimeout;
    /**
     * Wraps addEventListener to capture UI breadcrumbs
     * @param name the event name (e.g. "click")
     * @param handler function that will be triggered
     * @param debounce decides whether it should wait till another event loop
     * @returns wrapped breadcrumb events handler
     * @hidden
     */
    var domEventHandler = function (name, handler) {
        var lastCapturedEvent;
        return function (event) {
            // reset keypress timeout; e.g. triggering a 'click' after
            // a 'keypress' will reset the keypress debounce so that a new
            // set of keypresses can be recorded
            keypressTimeout = undefined;
            // It's possible this handler might trigger multiple times for the same
            // event (e.g. event propagation through node ancestors). Ignore if we've
            // already captured the event.
            if (!event || lastCapturedEvent === event) {
                return;
            }
            lastCapturedEvent = event;
            handler({ event: event, name: name });
        };
    };
    /**
     * Wraps addEventListener to capture keypress UI events
     * @param handler function that will be triggered
     * @returns wrapped keypress events handler
     * @hidden
     */
    var keypressEventHandler = function (handler) {
        // TODO: if somehow user switches keypress target before
        //       debounce timeout is triggered, we will only capture
        //       a single breadcrumb from the FIRST target (acceptable?)
        return function (event) {
            var target;
            try {
                target = event.target;
            }
            catch (e) {
                // just accessing event properties can throw an exception in some rare circumstances
                // see: https://github.com/getsentry/raven-js/issues/838
                return;
            }
            var tagName = target && target.tagName;
            // only consider keypress events on actual input elements
            // this will disregard keypresses targeting body (e.g. tabbing
            // through elements, hotkeys, etc)
            if (!tagName || (tagName !== 'INPUT' && tagName !== 'TEXTAREA' && !target.isContentEditable)) {
                return;
            }
            // record first keypress in a series, but ignore subsequent
            // keypresses until debounce clears
            !keypressTimeout && domEventHandler('input', handler)(event);
            clearTimeout(keypressTimeout);
            keypressTimeout = window.setTimeout(function () {
                keypressTimeout = undefined;
            }, debounceDuration);
        };
    };
    return [domEventHandler, keypressEventHandler];
};
var triggerHandlers = function (domBreadcrumb, type) {
    return function (data) {
        if (!type) {
            return;
        }
        try {
            domBreadcrumb(data);
        }
        catch (e) {
            // ignore
        }
    };
};
/**
 * Creates breadcrumbs from DOM API calls
 */
var domBreadcrumb = function (addBreadcrumb) { return function (handlerData) {
    var target;
    // Accessing event.target can throw (see getsentry/raven-js#838, #768)
    try {
        target = handlerData.event.target
            ? htmlTreeAsString(handlerData.event.target)
            : htmlTreeAsString(handlerData.event);
    }
    catch (e) {
        target = '<unknown>';
    }
    if (target.length === 0) {
        return;
    }
    addBreadcrumb({
        type: 'dom',
        category: "ui." + handlerData.name,
        message: target,
    });
}; };
