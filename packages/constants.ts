var REPORT_DOMAIN = 'apmplus.volces.com';
var SETTINGS_DOMAIN = REPORT_DOMAIN;
var SDK_VERSION = "1.5.0" ;
var SDK_NAME = 'APM_PLUS_WEB';
var SETTINGS_PATH = '/settings/get/webpro';
var BATCH_REPORT_PATH = '/monitor_web/collect';
var STORAGE_PREFIX = 'APMPLUS';
var DEFAULT_IGNORE_PATHS = [BATCH_REPORT_PATH, SETTINGS_PATH, '/monitor_browser/collect'];
var DEFAULT_SAMPLE_CONFIG = {
    sample_rate: 1,
    include_users: [],
    sample_granularity: 'session',
    rules: {},
};
var DEFAULT_SENDER_SIZE = 20;
