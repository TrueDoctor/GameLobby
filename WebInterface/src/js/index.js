import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';
import {MDCTabBar} from '@material/tab-bar';
import {MDCList} from '@material/list';
import {MDCRipple} from '@material/ripple';

import Interface from './modules/interface';
import UIManager from './modules/ui/uiManager';
import Networker from './modules/networking/networker';

const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const navigationDrawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
const lists = [...document.getElementsByClassName('game-list')].map(e => new MDCList(e));

// Top App Bar Menu
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  navigationDrawer.open = !navigationDrawer.open;
});
document.getElementById('main-content').addEventListener('click', () => navigationDrawer.open = false);

// Switch Game Tabs
tabBar.listen('MDCTabBar:activated', (event) => {
  for (let list of document.getElementsByClassName('games-listing')) {
    list.classList.add('hidden');
  }
  document.getElementById('listing_' + event.detail.index).classList.remove('hidden');
});

// TODO: Only after elements are added
// Initialize ripples for all list elements
lists.forEach(l => l.listElements.map((listItemEl) => new MDCRipple(listItemEl)));



const iface = new Interface();
const netMan = new Networker(iface);
const uiMan = new UIManager(iface);
uiMan.initLobby();
netMan.getServers();

// TODO: Implement URL-encoded starting position for games tab
// TODO: Save last game in cookies, initalize game page immediately, if game still active, otherwise build this page
