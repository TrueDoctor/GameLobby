import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';
import {MDCList} from '@material/list';
import {MDCTextField} from '@material/textfield';

import Interface from './modules/interface';
import UIManager from './modules/ui/uiManager';
import Networker from './modules/networking/networker';

const topAppBar = new MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
const navigationDrawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
const lists = [...document.getElementsByClassName('game-list')].map(e => new MDCList(e));
const searchBox = new MDCTextField(document.getElementById('search-bar'));

// Top App Bar Menu
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  navigationDrawer.open = !navigationDrawer.open;
});
document.getElementById('main-content').addEventListener('click', () => navigationDrawer.open = false);

const brightnessButton = document.getElementById('brightness_btn');
let currentBrightness = localStorage.getItem('brightness') ? localStorage.getItem('brightness') : 'auto';
switch (currentBrightness) {
  case 'light':
    document.body.className = 'light';
    brightnessButton.innerText = 'brightness_high';
    break;
  case 'dark':
    document.body.className = 'dark';
    brightnessButton.innerText = 'brightness_3';
    break;
  case 'auto':
    document.body.className = 'auto';
    brightnessButton.innerText = 'brightness_auto';
    break;
}

brightnessButton.addEventListener('click', () => {
  switch (currentBrightness) {
    case 'auto':
      currentBrightness = 'light';
      document.body.className = 'light';
      brightnessButton.innerText = 'brightness_high';
      localStorage.setItem('brightness', 'light');
      break;
    case 'light':
      currentBrightness = 'dark';
      document.body.className = 'dark';
      brightnessButton.innerText = 'brightness_3';
      localStorage.setItem('brightness', 'dark');
      break;
    case 'dark':
      currentBrightness = 'auto';
      document.body.className = 'auto';
      brightnessButton.innerText = 'brightness_auto';
      localStorage.setItem('brightness', 'auto');
      break;
  }
});

const iface = new Interface();
const netMan = new Networker(iface);
const uiMan = new UIManager(iface);
uiMan.initLobby();
netMan.getServers();
document.getElementById('search-input').addEventListener('input', e => iface.callMethod('serverListing', 'filter', e.target.value));


// TODO: Implement URL-encoded starting position for games tab
// TODO: Save last game in cookies, initalize game page immediately, if game still active, otherwise build this page
