import storageAvailable from '../browserStorage';

export default class BrightnessSwitch {
  constructor(id) {
    this.component = document.getElementById(id);
    this.brightness = 'auto';
    this.storage = (storageAvailable('localStorage')) ? window.localStorage :
                   (storageAvailable('sessionStorage')) ? window.sessionStorage :
                   {'setItem': _ => _, 'getItem': _ => 'auto'};

    this.getStoredBrightness();
    this.registerButton();
  }

  getStoredBrightness() {
    this.brightness = this.storage.getItem('brightness');

    switch (this.brightness) {
      case 'light':
        document.body.className = 'light';
        this.component.innerText = 'brightness_high';
        break;
      case 'dark':
        document.body.className = 'dark';
        this.component.innerText = 'brightness_3';
        break;
      case 'auto':
        document.body.className = 'auto';
        this.component.innerText = 'brightness_auto';
        break;
    }
  }

  registerButton() {
    this.component.addEventListener('click', () => {
      switch (this.brightness) {
        case 'auto':
          this.brightness = 'light';
          this.component.innerText = 'brightness_high';
          this.storage.setItem('brightness', 'light');
          document.body.className = 'light';
          break;
        case 'light':
          this.brightness = 'dark';
          this.component.innerText = 'brightness_3';
          this.storage.setItem('brightness', 'dark');
          document.body.className = 'dark';
          break;
        case 'dark':
          this.brightness = 'auto';
          this.component.innerText = 'brightness_auto';
          this.storage.setItem('brightness', 'auto');
          document.body.className = 'auto';
          break;
      }
    });
  }
}
