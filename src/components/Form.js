import { h, Component } from 'preact';

import localStorage from './../utils/localStorage';

import Item from './Item';

import './../styling/form.css';

class Form extends Component {
  onSubmit = e => {
    e.preventDefault();
    const { insert, update, selected } = this.props;
    const item = { src: e.currentTarget.elements[0].value };
    if (selected === null) {
      insert(null, item);
      return;
    }
    insert(selected.key, item);
  };

  remove = e => {
    e.preventDefault();
    const { selected, remove } = this.props;
    remove(selected);
  };

  render() {
    setTimeout(() => {
      this.source.focus();
    }, 400);

    const { selected } = this.props;
    return (
      <form onSubmit={this.onSubmit} class="layout-vertical">
        <input
          type="text"
          placeholder="Source or random"
          value={selected !== null ? selected.src : ''}
          ref={c => (this.source = c)}
        />
        <div class="layout-horizontal">
          <input type="submit" class="button" value="Save" />
          {selected !== null && (
            <input type="submit" class="button remove" value="Remove" onClick={this.remove} />
          )}
        </div>
      </form>
    );
  }
}

export default Form;
