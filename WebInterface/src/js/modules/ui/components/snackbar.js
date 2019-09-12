import {MDCSnackbar} from '@material/snackbar';

export default class Snackbar {
  constructor(message) {
    this.snack = document.createElement('div');
    const snackSurface = document.createElement('div');
    const snackLabel = document.createElement('div');
    const snackActions = document.createElement('div');
    const snackDismiss = document.createElement('button');

    this.snack.className = 'mdc-snackbar';
    snackSurface.className = 'mdc-snackbar__surface';
    snackLabel.className = 'mdc-snackbar__label';
    snackLabel.innerText = message;
    snackLabel.setAttribute('role', 'status');
    snackLabel.setAttribute('aria-live', 'polite');
    snackActions.className = 'mdc-snackbar__actions';
    snackDismiss.className = 'mdc-icon-button mdc-snackbar__dismiss material-icons';
    snackDismiss.title = 'Schließen';
    snackDismiss.innerText = 'close';

    snackActions.appendChild(snackDismiss);
    snackSurface.appendChild(snackLabel);
    snackSurface.appendChild(snackActions);
    this.snack.appendChild(snackSurface);

    this.snackbar = new MDCSnackbar(this.snack);
  }

  getMDCSnackbar() {
    return this.snackbar;
  }

  getHTMLElement() {
    return this.snack;
  }
}
