import { h, Component } from 'preact';

import localStorage from './../utils/localStorage';

import Item from './Item';

import './../styling/list.css';

class List extends Component {
  shouldComponentUpdate(props) {
    return props.added !== this.props.added;
  }

  render() {
    const { items, edit } = this.props;
    return (
      <div class="list-container">
        <ul class="list">
          {items.map(item => <Item item={item} src={item.src} edit={edit} key={item.key} />)}
        </ul>
      </div>
    );
  }
}

export default List;
