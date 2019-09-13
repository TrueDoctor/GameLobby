import {MDCTabBar} from '@material/tab-bar';
import {MDCDialog} from '@material/dialog';
import {MDCTextField} from '@material/textfield';
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

    iface.addObject(this, 'serverListing', ['addElements', 'addCategories', 'startLoadingAnimation', 'stopLoadingAnimation']);
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
   * Replaces lists with loader
   */
  startLoadingAnimation() {
    for (let list of this.gameListDiv.children) {
      if (!list.classList.contains('hidden')) {
        list.classList.add('hidden');
        this.lastSelected = list.id;
        break;
      }
    }

    // Creation via dom node seems heavily bugged right now,
    //   so going the less pretty route
    let spinner;
    if ((spinner = document.querySelector('.spinner')) === null) {
      this.gameListDiv.innerHTML += '<svg class="spinner" width="127px" height="127px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><circle class="path" fill="none" stroke-width="10" stroke-linecap="round" cx="64" cy="64" r="59"></circle></svg>';
    } else {
      spinner.classList.remove('hidden');
    }
  }

  stopLoadingAnimation() {
    let spinner = document.querySelector('.spinner');
    if (spinner !== null) spinner.classList.add('hidden');

    // Animate showing last selected category again
    if (this.lastSelected !== undefined) {
      document.getElementById(this.lastSelected).classList.add('loading');
      document.getElementById(this.lastSelected).classList.remove('hidden');
    } else {
      document.getElementById('listing-0').classList.add('loading');
      document.getElementById('listing-0').classList.remove('hidden');
    }
    setTimeout(() => {
      if (this.lastSelected !== undefined) {
        document.getElementById(this.lastSelected).classList.remove('loading');
      } else {
        document.getElementById('listing-0').classList.remove('loading');
      }
    }, 0);
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
    this.types = {};

    const lastCategory = (this.lastSelected === undefined) ? 0 : parseInt(this.lastSelected[this.lastSelected.length - 1]);

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


      tabButton.className = (i == lastCategory) ? 'mdc-tab mdc-tab--active' : 'mdc-tab';
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
      tabIndicator.className = (i == lastCategory) ? 'mdc-tab-indicator mdc-tab-indicator--active' : 'mdc-tab-indicator';
      tabIndicator.innerHTML = '<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>';
      tabRipple.className = 'mdc-tab__ripple';
      gamesList.className = 'games-listing hidden';
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
      this.types[category.name] = category.displayName;

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
        this.showLoginDialog(id, name, type, hasPassword);
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

  showLoginDialog(id, name, type, needsPassword) {
    if (this.dialogBox != undefined) document.querySelector('body').removeChild(this.dialogBox);
    this.dialogBox = document.createElement('div');
    const dialogContainer = document.createElement('div');
    const dialogSurface = document.createElement('div');
    const dialogTitle = document.createElement('h2');
    const dialogSubtitle = document.createElement('span');
    const dialogContent = document.createElement('div');
    const userNameDiv = document.createElement('div');
    const userNameInput = document.createElement('input');
    const userNameLabel = document.createElement('label');
    const userNameRipple = document.createElement('div');
    const passwordDiv = document.createElement('div');
    const passwordInput = document.createElement('input');
    const passwordLabel = document.createElement('label');
    const passwordRipple = document.createElement('div');
    const dialogOptions = document.createElement('footer');
    const abortButton = document.createElement('button');
    const loginButton = document.createElement('button');
    const scrim = document.createElement('div');

    this.dialogBox.className = "mdc-dialog";
    this.dialogBox.setAttribute('role', 'dialog');
    this.dialogBox.setAttribute('aria-modal', 'true');
    this.dialogBox.setAttribute('aria-labelledby', 'login-title');
    this.dialogBox.setAttribute('aria-describedby', 'login-description');
    dialogContainer.className = 'mdc-dialog__container';
    dialogSurface.className = 'mdc-dialog__surface';
    dialogTitle.className = 'mdc-dialog__title';
    dialogTitle.id = 'login-title';
    dialogTitle.innerText = name;
    dialogSubtitle.className = 'mdc-typography--subtitle1 mdc-theme--text-secondary-on-light';
    dialogSubtitle.innerText = this.types[type];
    dialogContent.className = 'mdc-dialog__content';
    dialogContent.id = 'login-description';
    userNameDiv.className = 'mdc-text-field';
    userNameInput.setAttribute('type', 'text');
    userNameInput.id = 'username-input';
    userNameInput.className = 'mdc-text-field__input';
    userNameLabel.className = 'mdc-floating-label';
    userNameLabel.setAttribute('for', 'username-input');
    userNameLabel.innerText = 'Name';
    userNameRipple.className = 'mdc-line-ripple';
    if (needsPassword) {
      passwordDiv.className = 'mdc-text-field';
      passwordInput.setAttribute('type', 'password');
      passwordInput.id = 'password-input';
      passwordInput.className = 'mdc-text-field__input';
      passwordLabel.className = 'mdc-floating-label';
      passwordLabel.setAttribute('for', 'password-input');
      passwordLabel.innerText = 'Serverpasswort';
      passwordRipple.className = 'mdc-line-ripple';
    }
    dialogOptions.className = 'mdc-dialog__actions';
    abortButton.setAttribute('type', 'button');
    abortButton.className = 'mdc-button mdc-dialog__button';
    abortButton.setAttribute('data-mdc-dialog-action', 'cancel');
    abortButton.innerText = 'Abbrechen';
    loginButton.setAttribute('type', 'button');
    loginButton.className = 'mdc-button mdc-dialog__button';
    loginButton.setAttribute('data-mdc-dialog-action', 'accept');
    loginButton.setAttribute('data-mdc-dialog-button-default', 'true');
    loginButton.innerText = 'Beitreten';
    scrim.className = 'mdc-dialog__scrim';

    userNameDiv.appendChild(userNameInput);
    userNameDiv.appendChild(userNameLabel);
    userNameDiv.appendChild(userNameRipple);
    dialogContent.appendChild(userNameDiv);
    if (needsPassword) {
      dialogContent.appendChild(document.createElement('br'));
      passwordDiv.appendChild(passwordInput);
      passwordDiv.appendChild(passwordLabel);
      passwordDiv.appendChild(passwordRipple);
      dialogContent.appendChild(passwordDiv);
    }
    dialogOptions.appendChild(loginButton);
    dialogOptions.appendChild(abortButton);
    dialogTitle.appendChild(document.createElement('br'));
    dialogTitle.appendChild(dialogSubtitle);
    dialogSurface.appendChild(dialogTitle);
    dialogSurface.appendChild(dialogContent);
    dialogSurface.appendChild(dialogOptions);
    dialogContainer.appendChild(dialogSurface);
    this.dialogBox.appendChild(dialogContainer);
    this.dialogBox.appendChild(scrim);
    document.querySelector('body').appendChild(this.dialogBox);

    this.usernameField = new MDCTextField(userNameDiv);
    if (needsPassword) {
      this.passwordField = new MDCTextField(passwordDiv);
    }
    this.dialog = new MDCDialog(this.dialogBox);
    this.dialog.open();

    this.dialog.listen('MDCDialog:closed', (e) => {
      if (this.dialogBox != undefined) {
        document.querySelector('body').removeChild(this.dialogBox);
        this.dialogBox = undefined;
      }

      if (e.detail.action == 'accept') {
        const username = this.usernameField.value;
        const password = this.passwordField.value;
        let status = 400;

        this.startLoadingAnimation();
        this.iface.callMethod('networker', 'sendLogin', id, username, password)
            .then(response => {
              status = response.status;
              return response.text();
            }).then(text => {
              let message;
              switch(status) {
                case 400:
                  message = 'Der Server hat die Anfrage zurückgewiesen.';
                  break;
                case 401:
                  if (text == 'name') message = 'Der Nutzermame ist schon vergeben.';
                  else if (text == 'pass') message = 'Ungültiges Passwort';
                  this.dialog.open();
                  break;
                case 404:
                  message = 'Der Server existiert nicht mehr.';
                  break;
                case 500:
                  message = 'Ein Serverfehler ist aufgetreten.';
                  this.dialog.open();
                  break;
                case 200:
                  // TODO: LOGIN
                  console.log('NYI: LOGING');
                  console.log(text);
                  return;
                default:
                  message = 'Ein Fehler ist aufgetreten: ' + status.toString();
                  break;
              }
              this.iface.callMethod('snackBar', 'createSnack', message);
              this.stopLoadingAnimation();
            }).catch(e => {
              console.error(e.toString());
              this.iface.callMethod('snackBar', 'createSnack', 'Ein Fehler ist aufgetreten.');
              this.stopLoadingAnimation();
            });
      }
    });
  }
}
