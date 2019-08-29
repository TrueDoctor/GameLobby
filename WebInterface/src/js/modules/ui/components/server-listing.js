/**
 * Class for handling the server list
 */
export default class ServerListing {
  /**
   * Creates reference to container
   * @param {Interface} iface Interface for comm. with other objects
   * @param {string} serverListId ID of the server list div
   * @param {string} refreshBtnId ID of the refresh btn
   */
  constructor(iface, serverListId, refreshBtnId) {
    this.ids = {serverListId, refreshBtnId};

    iface.addObject(this, 'serverListing', ['flushElements', 'addElements']);
    this.iface = iface;
  }

  /**
   * Initializes Server List DOM Element
   */
  initialize() {
    this.serverListing = document.getElementById(this.ids.serverListId);
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
    this.serverListing.innerHTML = '';
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

      let serverDiv = document.createElement('div');
      let nameSpan = document.createElement('span');
      let rightAlignDiv = document.createElement('div');
      let locked = document.createElement('div');
      let playerCountSpan = document.createElement('span');
      let playerCountStaticSpan = document.createElement('span');
      let joinButton = document.createElement('button');
      serverDiv.className = 'server';
      nameSpan.className = 'server-name';
      rightAlignDiv.className = 'right-aligned-items';
      locked.className = 'lock-icon';
      playerCountSpan.className = 'player-count';
      playerCountStaticSpan.className = 'player-count-static';
      joinButton.className = 'btn join-btn';
      joinButton.id = 'join';
      nameSpan.textContent = name;
      playerCountSpan.textContent = playerAmount.toString() + ' / ' + playerMax.toString();
      playerCountStaticSpan.textContent = 'Spieler online';
      locked.innerHTML = hasPassword ? '<i class="material-icons">lock</i>' : '<i class="material-icons">lock_open</i>';
      joinButton.textContent = 'Beitreten';
      joinButton.addEventListener('click', () => {
        this.iface.callMethod('login', 'showLogin', name);
      });

      rightAlignDiv.appendChild(playerCountSpan);
      rightAlignDiv.appendChild(playerCountStaticSpan);
      rightAlignDiv.appendChild(locked);
      rightAlignDiv.appendChild(joinButton);
      serverDiv.appendChild(nameSpan);
      serverDiv.appendChild(rightAlignDiv);
      this.serverListing.appendChild(serverDiv);
    }
  }
}
