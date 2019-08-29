import Interface from './modules/interface';
import UIManager from './modules/ui/uiManager';
import Networker from './modules/networking/networker';

let iface = new Interface();
let uiMan = new UIManager(iface);
uiMan.initLogin();

let netMan = new Networker(iface);
netMan.getServers();
