import './hash';

/**
 * Class for communication to server
 */
export default class Networker {
  /**
   * Creates new Networker and connects it to the Interface
   * @param {Interface} iface Interface for communication between objects
   * @param {String} url URL of the server backend
   */
  constructor(iface, url) {
    this.url = url;

    // Register in Interface
    iface.addObject(this, 'networker', ['getServers', 'sendLogin']);
    this.iface = iface;
    this.refreshing = false;
  }

  /**
   * Requests server list from API
   */
  getServers() {
    if (this.refreshing) return;
    this.refreshing = true;
    this.iface.callMethod('serverListing', 'startLoadingAnimation');

    fetch(process.env.API_URL)
      .then(response => response.json())
      .then(data => {
        this.iface.callMethod('serverListing', 'addCategories', data['gameTypes']);
        this.iface.callMethod('serverListing', 'addElements', data['games']);
        this.iface.callMethod('serverListing', 'stopLoadingAnimation');
        this.refreshing = false;
      })
      .catch(error => {
        console.error(error.toString());
        this.iface.callMethod('snackBar', 'createSnack', 'Ein Fehler ist aufgetreten.');
        this.iface.callMethod('serverListing', 'stopLoadingAnimation');
      });
  }

  sendLogin(id, name, password) {
    return password.getHash().then((hashedPass) => fetch(process.env.API_LOGIN + id, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
          'Content-Type': 'application/json',
      },
      redirect: 'manual',
      body: JSON.stringify({name, 'password': hashedPass}),
    }));
  }
}
