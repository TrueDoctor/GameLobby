import ServerListing from '../components/server-listing';

/**
 * UI Loader for login page
 */
export default class Login {
  /**
   * Registers components for login page
   * @param {Interface} iface Interface to enable comm. with notifications
   */
  constructor(iface) {
    this.serverListing = new ServerListing(iface, 'game-list',
        'refresh-btn');

    this.serverListing.initialize();
  }
}
