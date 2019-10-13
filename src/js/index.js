import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';
import {MDCList} from '@material/list';
import {MDCTextField} from '@material/textfield';

import Interface from './modules/interface';
import UIManager from './modules/ui/uiManager';
import Networker from './modules/networking/networker';
import BrightnessSwitch from './modules/ui/brightnessSwitch';

const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const navigationDrawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const lists = [...document.getElementsByClassName('game-list')].map(e => new MDCList(e));
const searchBox = new MDCTextField(document.getElementById('search-bar'));
const brightnessControl = new BrightnessSwitch('brightness_btn');

// Top App Bar Menu
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  navigationDrawer.open = !navigationDrawer.open;
});
document.getElementById('main-content').addEventListener('click', () => navigationDrawer.open = false);

const iface = new Interface();
const netMan = new Networker(iface);
const uiMan = new UIManager(iface);
uiMan.initLobby();
netMan.getServers();
document.getElementById('search-input').addEventListener('input', e => iface.callMethod('serverListing', 'filter', e.target.value));
