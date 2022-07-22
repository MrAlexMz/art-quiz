import { navigate } from './navigation';

export class Settings {
  init() {
    this.createSettings();
  }

  destroy() {
    this.settings.remove();
  }

  createSettings() {
    this.application = document.querySelector('.application');
    this.savedSettings = JSON.parse(localStorage.getItem('settings')) ?? {
      timerValue:30,
      timerToggle:false,
      volumeValue:4,
      volumeToggle:false
    };
    this.settings = document.createElement('div');
    this.settings.innerHTML = `<section class="settings">
    <div class="container">
        <header class="header">
            <div class="header__logo"></div>
        </header>
        <div class="settings__wrapper">
            <div class="settings__item">
                <div class="settings__item-icon">
                    <img src="./assets/svg/timer-picture.svg" alt="timer">
                </div>
                <div class="settings__item-wrapper">
                    <input class="settings__item-range" id="timer-range" value="${
                      localStorage.getItem('settings') !== null
                        ? this.savedSettings.timerValue
                        : '15'
                    }" type="range" min="5" max="30" step="5" oninput="this.nextElementSibling.value = this.value">
                    <output class="settings__item-time">${this.savedSettings.timerValue}</output>
                </div>
                <input class="settings__item-check" id="timer-checkbox" type="checkbox" ${
                  this.savedSettings.timerToggle === 'on' ? 'checked="checked"' : ''
                }>
                <label class="settings__item-label" for="timer-checkbox">ON/OFF</label>
                <div class="settings__item-text">TIME</div>
            </div>
            <div class="settings__item">
                <div class="settings__item-icon icon-volume">
                    <img src="./assets/svg/volume-on.svg" alt="volume">
                </div>
                <div class="settings__item-wrapper">
                    <button class="volume-btn"></button>
                    <input class="settings__item-range" id="volume-range" type="range" value="${
                      localStorage.getItem('settings') !== null
                        ? this.savedSettings.volumeValue
                        : '1'
                    }" min="0" max="10" step="1" oninput="this.nextElementSibling.value = this.value">
                    <output class="settings__item-volume">${this.savedSettings.volumeValue}</output>
                </div>
                <input class="settings__item-check" id="volume-checkbox" type="checkbox" ${
                  this.savedSettings.volumeToggle === 'on' ? 'checked="checked"' : ''
                }>
                <label class="settings__item-label" for="volume-checkbox">ON/OFF</label>
                <div class="settings__item-text">VOLUME</div>
            </div>
        </div>
        <button class="btn settings__btn">Save</button>
      </div>
    </section>`;
    this.application.append(this.settings);
    document.querySelector('settingsSaveBtn', '.settings__btn');
    const settingsSaveBtn = document.querySelector('.settings__btn');
    settingsSaveBtn.addEventListener('click', () => {
      this.saveSettings();
      navigate('mainPage', 'settings');
    });
  }

  saveSettings() {
    this.settingsConfig = {
      timerValue: document.querySelector('.settings__item-time').innerHTML,
      timerToggle: document.getElementById('timer-checkbox').checked,
      volumeValue: document.querySelector('.settings__item-volume').innerHTML,
      volumeToggle: document.getElementById('volume-checkbox').checked,
    };
    localStorage.setItem('settings', JSON.stringify(this.settingsConfig));
  }
}
