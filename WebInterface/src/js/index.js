import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';
// import {MDCTabBar} from '@material/tab-bar';

// import Interface from './modules/interface';
// import UIManager from './modules/ui/uiManager';
// import Networker from './modules/networking/networker';


const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const navigationDrawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  navigationDrawer.open = !navigationDrawer.open;
});
document.getElementById('main-content').addEventListener('click', () => navigationDrawer.open = false);


// const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

// const iface = new Interface();
// const uiMan = new UIManager(iface);
// uiMan.initLogin();
// const netMan = new Networker(iface);
// netMan.getServers();

// TODO: Implement URL-encoded starting position for games tab
