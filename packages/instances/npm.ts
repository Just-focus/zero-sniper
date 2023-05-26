import { createBrowserClient } from '../client';
import { npmPreCollect } from './npm-precollect';

	
var browserClient = createBrowserClient();
var win = getDefaultBrowser();
win && npmPreCollect(win, browserClient);
