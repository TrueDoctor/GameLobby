import listUrl from '../../vars';

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
    iface.addObject(this, 'networker', ['getServers']);
    this.iface = iface;
    this.refreshing = false;
  }

  /**
   *
   */
  getServers() {
    if (this.refreshing) return;
    this.refreshing = true;

    let data = {
      "games": [
        {"name": "server_1", "playerNum": 3, "maxPlayers": 2, "hasPassword": false, "type": "ratatosk"},
        {"name": "foo", "playerNum": 0, "maxPlayers": 2,  "hasPassword": true, "type": "dsa"},
        {"name": "bar", "playerNum": 1000000, "maxPlayers": 2,  "hasPassword": true, "type": "ratatosk"}
      ]
    };
    this.iface.callMethod('serverListing', 'flushElements');
    this.iface.callMethod('serverListing', 'addElements', data);
    this.refreshing = false;

    // fetch(listUrl)
    //   .then(response => response.json())
    //   .then(data => this.iface.callMethod('serverListing', 'addElements', data));
  }
}
