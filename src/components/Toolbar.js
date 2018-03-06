import { h, Component } from 'preact';

import './../styling/toolbar.css';

class Toolbar extends Component {
  shouldComponentUpdate(props) {
    return props.open !== this.props.open;
  }

  render() {
    return (
      <div class="toolbar">
        <h1 class="toolbar-title">Preact Gallery</h1>
        <svg
          className={`toolbar-settings ${this.props.open ? 'active' : ''}`}
          fill="#FFFFFF"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          onClick={this.props.settings}
        >
          {[6, 12, 18].map(y => <circle cx="12" cy={y} r="2" />)}
        </svg>
      </div>
    );
  }
}

export default Toolbar;
