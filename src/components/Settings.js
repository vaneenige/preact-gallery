import { h, Component } from 'preact';

import './../styling/settings.css';

import localStorage from './../utils/localStorage';

class Settings extends Component {
  state = {
    night: localStorage.find('night') || false,
  };

  componentDidMount() {
    if (this.state.night) this.setThemeAttributes(this.state.night);
  }

  setThemeAttributes(night, initial) {
    if (night) document.body.classList.add('night');
    else document.body.classList.remove('night');

    const addition = night ? '-night' : '';
    document
      .querySelector(`[rel="icon"]`)
      .setAttribute('href', `/assets/icons/favicon${addition}.ico`);
    document
      .querySelector('[rel="apple-touch-icon"]')
      .setAttribute('href', `/assets/icons/PG_IOS${addition}.png`);
    document.querySelector(`[rel="manifest"]`).setAttribute('href', `/manifest${addition}.json`);
    document
      .querySelector('[name="theme-color"]')
      .setAttribute('content', night ? '#263238' : '#673ab8');
  }

  render() {
    if (this.props.total !== 0) this.storage = true;

    const settings = [
      {
        title: 'Toggle Night Mode',
        subtitle: `Night mode is turned ${this.state.night ? 'on' : 'off'}`,
        handler: () => {
          this.setThemeAttributes(!this.state.night);
          localStorage.insert('night', !this.state.night);
          this.setState({ night: !this.state.night });
        },
      },
      {
        title: 'Clear all data',
        subtitle: this.storage
          ? `Total storage used: ${(this.props.total / 1000).toFixed(1)}kB`
          : 'All images will be removed',
        handler: this.props.clear,
      },
    ];

    return (
      <ul class="settings">
        <span class="settings-label">Settings</span>
        {settings.map(setting => (
          <li class="settings-content" onClick={setting.handler}>
            <div class="settings-title">{setting.title}</div>
            <div class="settings-subtitle">{setting.subtitle}</div>
          </li>
        ))}
      </ul>
    );
  }
}

export default Settings;
