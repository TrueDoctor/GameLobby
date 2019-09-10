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

    fetch(process.env.API_URL)
      .then(response => response.json())
      .then(data => {
        this.iface.callMethod('serverListing', 'flusElements');
        this.iface.callMethod('serverListing', 'addCategories', data['gameTypes']);
        this.iface.callMethod('serverListing', 'addElements', data['games']);
        this.refreshing = false;
      })
      .catch(error => console.error('Error:', error));
  }
}
