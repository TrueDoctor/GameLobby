/**
 * Class for handling the server list
 */
export default class ServerListing {
  /**
   * Creates reference to container
   * @param {Interface} iface Interface for comm. with other objects
   * @param {string} serverListClass Class name of the server lists ul
   * @param {string} refreshBtnId ID of the refresh btn
   */
  constructor(iface, serverListClass, refreshBtnId) {
    this.ids = {serverListClass, refreshBtnId};

    iface.addObject(this, 'serverListing', ['flushElements', 'addElements']);
    this.iface = iface;
  }

  /**
   * Initializes Server List DOM Element
   */
  initialize() {
    this.allServerLists = [...document.getElementsByClassName(this.ids.serverListClass)];
    this.serverListings = {}
    for (let list of this.allServerLists) {
      this.serverListings[list.getAttribute('type')] = list;
    }

    this.refreshBtn = document.getElementById(this.ids.refreshBtnId);
    this.registerEvents();
  }

  /**
   * Registers events associated with server list UI
   */
  registerEvents() {
    this.registerRefreshEvent();
  }

  /**
   * Registers event for pushing the refresh button
   */
  registerRefreshEvent() {
    this.refreshBtn.addEventListener('click', () => {
      this.iface.callMethod('networker', 'getServers');
    });
  }

  /**
   * Removes all elements currently in the server listing
   */
  flushElements() {
    for (let list of this.allServerLists) {
      list.innerHTML = '';
    }
  }

  /**
   * Populates servers from a given array of games
   * @param {object} JSON-Data of servers
   */
  addElements(data) {
    for (let server of data['games']) {
      const name = server['name'];
      const playerAmount = server['playerNum'];
      const playerMax = server['maxPlayers'];
      const hasPassword = server['hasPassword'];
      const type = server['type'];

      let item = document.createElement('li');
      let lockIconSpan = document.createElement('span');
      let nameSpan = document.createElement('span');
      let playerSpan = document.createElement('span');

      item.classList.add('mdc-list-item');
      lockIconSpan.classList.add('mdc-list-item__graphic');
      lockIconSpan.classList.add('material-icons');
      lockIconSpan.setAttribute('aria-hidden', 'true');
      nameSpan.classList.add('mdc-list-item__text');
      playerSpan.classList.add('mdc-list-item__meta');

      nameSpan.textContent = name;
      lockIconSpan.innerHTML = hasPassword ? 'lock' : 'lock_open';
      playerSpan.textContent = playerAmount.toString() + ' / ' + playerMax.toString();

      item.addEventListener('click', () => {
        this.iface.callMethod('login', 'showLogin', name);
      });

      item.appendChild(lockIconSpan);
      item.appendChild(nameSpan);
      item.appendChild(playerSpan);
      this.serverListings[type].appendChild(item);
    }
  }
}
