import { h, Component } from 'preact';

import './../styling/item.css';

class Item extends Component {
  state = {
    loaded: false,
  };

  shouldComponentUpdate(props) {
    return props.src !== this.props.src;
  }

  onClick = () => {
    this.props.edit(this.props.item);
  };

  render() {
    const { item, src } = this.props;
    return (
      <li class="item">
        <button
          class="item-container"
          onClick={this.onClick}
          style={
            src !== null
              ? `background: url('${window.location.href}image/${btoa(src)}') center/cover`
              : ''
          }
        >
          {item.size !== 0 && (
            <div class="item-information">{`${(item.size / 1000).toFixed(1)}kB`}</div>
          )}
        </button>
      </li>
    );
  }
}

export default Item;
