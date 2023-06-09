var PRECOLLECT = 'precollect';
var BOTTOM_UP_TIME = 1000 * 60 * 5;
export function npmPreCollect(window, client) {
    // precollect error
    if ('addEventListener' in window) {
        client.pcErr = function (ev) {
            ev = ev || window.event;
            var target = ev.target || ev.srcElement || {};
            if (target instanceof Element || target instanceof HTMLElement) {
                if (target.getAttribute('integrity')) {
                    client(PRECOLLECT, 'sri', target.getAttribute('href') || target.getAttribute('src'));
                }
                else {
                    client(PRECOLLECT, 'st', {
                        tagName: target.tagName,
                        url: target.getAttribute('href') || target.getAttribute('src'),
                    });
                }
            }
            else {
                client(PRECOLLECT, 'err', ev.error);
            }
        };
        client.pcRej = function (ev) {
            ev = ev || window.event;
            client(PRECOLLECT, 'err', ev.reason || (ev.detail && ev.detail.reason));
        };
        window.addEventListener('error', client.pcErr, true);
        window.addEventListener('unhandledrejection', client.pcRej, true);
        // bottom-up cleanup logic, if user not start client or load async script error
        setTimeout(function () {
            window.removeEventListener('error', client.pcErr, true);
            window.removeEventListener('unhandledrejection', client.pcRej, true);
        }, BOTTOM_UP_TIME);
    }
    // precollect performance
    if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
        client.pp = { entries: [] };
        client.pp.observer = new PerformanceObserver(function (list) {
            client.pp.entries = client.pp.entries.concat(list.getEntries());
        });
        client.pp.observer.observe({
            entryTypes: ['longtask', 'largest-contentful-paint', 'layout-shift'],
        });
        // bottom-up cleanup logic, if user not start client or load async script error
        setTimeout(function () {
            client.pp.observer.disconnect();
        }, BOTTOM_UP_TIME);
    }
}
