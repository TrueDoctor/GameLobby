import SnackBar from './snackbar';

export default class SnackBarController {
  /**
   * Creates new controller to keep track of current snackbars
   * @param {string} appendTo css query of element to append snackbars to
   */
  constructor(iface, appendTo) {
    this.iface = iface;
    iface.addObject(this, 'snackBar', 'createSnack');

    this.currentSnack = null;
    this.snackList = [];
    this.snackContainer = document.querySelector(appendTo);
  }

  sendNextSnack() {
    if (this.currentSnack !== null) {
      this.currentSnack.getMDCSnackbar().close();
      this.snackContainer.removeChild(this.currentSnack.getHTMLElement());
    }

    if (this.snackList.length == 0) return;

    this.currentSnack = this.snackList.splice(0, 1)[0];
    this.snackContainer.appendChild(this.currentSnack.getHTMLElement());
    this.currentSnack.getMDCSnackbar().open();
  }

  createSnack(message) {
    const snack = new SnackBar(message);
    snack.getMDCSnackbar().listen('MDCSnackbar:closed', () => {
      this.snackContainer.removeChild(snack.getHTMLElement());
      this.currentSnack = null;
      this.sendNextSnack();
    });
    this.snackList.push(snack);

    if (this.currentSnack === null) this.sendNextSnack();

    return snack;
  }
}
