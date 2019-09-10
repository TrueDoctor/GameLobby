import {MDCTabBar} from '@material/tab-bar';
import {MDCRipple} from "@material/ripple";

/**
 * Class for handling the server list
 */
export default class ServerListing {
  /**
   * Creates reference to container
   * @param {Interface} iface Interface for comm. with other objects
   * @param {string} tabBarId ID of the Tab Bar containing the Tab Buttons
   * @param {string} gameListDivId ID of the Div containing the individual games lists
   * @param {string} refreshBtnId ID of the refresh btn
   */
  constructor(iface, tabBarId, gameListDivId, refreshBtnId) {
    this.ids = {tabBarId, gameListDivId, refreshBtnId};

    iface.addObject(this, 'serverListing', ['flushElements', 'addElements', 'addCategories', 'startLoadingAnimation']);
    this.iface = iface;
  }

  /**
   * Initializes Server List DOM Element
   */
  initialize() {
    this.refreshBtn = document.getElementById(this.ids.refreshBtnId);
    this.tabBar = document.getElementById(this.ids.tabBarId);
    this.gameListDiv = document.getElementById(this.ids.gameListDivId);

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
   * Replaces lists with loader
   */
  startLoadingAnimation() {
    this.gameListDiv.innerHTML = '<svg class="spinner" width="127px" height="127px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="10" stroke-linecap="round" cx="64" cy="64" r="59"></circle></svg>';
  }

  /**
   * Populates Tab Bar with game categories, received from server
   * @param {object} data JSON-Data representing categories from server
   */
  addCategories(data) {
    this.tabBar.innerHTML = '';
    this.gameListDiv.innerHTML = '';
    this.listContainers = [];
    this.allServerLists = [];
    this.serverListings = {};

    for (let i = 0; i < data.length; i++) {
      const category = data[i];
      const tabButton = document.createElement('button');
      const tabContent = document.createElement('span');
      const tabIcon = document.createElement('img');
      const tabName = document.createElement('span');
      const tabIndicator = document.createElement('span');
      const tabRipple = document.createElement('span');
      const gamesList = document.createElement('div');
      const innerList = document.createElement('ul');

      tabButton.className = (i == 0) ? 'mdc-tab mdc-tab--active' : 'mdc-tab';
      tabButton.setAttribute('role', 'tab');
      tabButton.setAttribute('aria-selected', 'true');
      if (i == 0) tabButton.setAttribute('tabindex', '0');
      tabButton.setAttribute('game-type', category.name);
      tabContent.className = 'mdc-tab__content';
      tabIcon.className = 'game-icon';
      tabIcon.width = '24';
      tabIcon.height = '24';
      tabIcon.src = category.icon;
      tabName.className = 'mdc-tab__text-label';
      tabName.innerText = category.displayName;
      tabIndicator.className = (i == 0) ? 'mdc-tab-indicator mdc-tab-indicator--active' : 'mdc-tab-indicator';
      tabIndicator.innerHTML = '<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>';
      tabRipple.className = 'mdc-tab__ripple';
      gamesList.className = (i == 0) ? 'games-listing loading' : 'games-listing hidden';
      if (i == 0) setTimeout(() => gamesList.className = 'games-listing', 0);
      gamesList.id = 'listing-' + i.toString();
      innerList.className = 'game-list mdc-list'
      innerList.id = 'games-list-' + category.name;
      innerList.setAttribute('type', category.name);

      tabContent.appendChild(tabIcon);
      tabContent.appendChild(tabName);
      tabButton.appendChild(tabContent);
      tabButton.appendChild(tabIndicator);
      tabButton.appendChild(tabRipple);
      gamesList.appendChild(innerList);
      new MDCRipple(tabRipple);

      this.listContainers.push(gamesList);
      this.allServerLists.push(innerList);
      this.serverListings[category.name] = innerList;

      this.tabBar.appendChild(tabButton);
      this.gameListDiv.appendChild(gamesList);
    }

    this.mdcTabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
    this.mdcTabBar.listen('MDCTabBar:activated', (event) => {
      for (let list of this.listContainers) {
        list.classList.add('hidden');
      }
      this.listContainers[event.detail.index].classList.remove('hidden');
    });
  }

  /**
   * Populates servers from a given array of games
   * @param {array} Server List received from server
   */
  addElements(data) {
    // TODO: REMOVE; JUST FOR STRESS TESTING
    const l = data.length;
    for (let i = 0; i < l; i++) {
      for (let j = 0; j < 50; j++) data.push(data[i]);
    }
    data.push({
      "name": "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",
      "userCount": 0,
      "maxUsers": 5,
      "hasPassword": true,
      "type": "dsa",
      "id": 0
    });
    // ------

    for (let server of data) {
      const name = server['name'];
      const playerAmount = server['userCount'];
      const playerMax = server['maxUsers'];
      const hasPassword = server['hasPassword'];
      const type = server['type'];
      const id = server['id'];

      let item = document.createElement('li');
      let lockIconSpan = document.createElement('span');
      let nameSpan = document.createElement('span');
      let playerSpan = document.createElement('span');

      item.classList.add('mdc-list-item');
      item.setAttribute('server-id', id);
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

      new MDCRipple(item);

      try {
        this.serverListings[type].appendChild(item);
      } catch (e) {
        console.error(e.toString());
      }
    }
  }
}
