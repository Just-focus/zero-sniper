// 常数
const REPORT_DOMAIN = 'apmplus.volces.com';
const SETTINGS_DOMAIN = REPORT_DOMAIN;
const SDK_VERSION = "1.5.0" ;
const SDK_NAME = 'APM_PLUS_WEB';
const SETTINGS_PATH = '/settings/get/webpro';
const BATCH_REPORT_PATH = '/monitor_web/collect';
const STORAGE_PREFIX = 'APMPLUS';
const DEFAULT_IGNORE_PATHS = [BATCH_REPORT_PATH, SETTINGS_PATH, '/monitor_browser/collect'];
const DEFAULT_SAMPLE_CONFIG = {
  sample_rate: 1,
  include_users: [],
  sample_granularity: 'session',
  rules: {},
};
const DEFAULT_SENDER_SIZE = 20;

// 时间
const EVENTS = [
	'init',
	'start',
	'config',
	'beforeDestroy',
	'provide',
	'beforeReport',
	'report',
	'beforeBuild',
	'build',
	'beforeSend',
	'send',
	'beforeConfig',
];

export {
  BATCH_REPORT_PATH,
  DEFAULT_IGNORE_PATHS,
  DEFAULT_SAMPLE_CONFIG,
  DEFAULT_SENDER_SIZE,
  REPORT_DOMAIN,
  SDK_NAME,
  SDK_VERSION,
  SETTINGS_DOMAIN,
  SETTINGS_PATH,
  STORAGE_PREFIX,
	EVENTS
}
