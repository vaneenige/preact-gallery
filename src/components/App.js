import { h, Component } from 'preact';

import localStorage from './../utils/localStorage';
import serviceWorker from './../utils/serviceWorker';

import Toolbar from './Toolbar';
import List from './List';
import Modal from './Modal';
import Form from './Form';
import Settings from './Settings';

import './../styling/app.css';

class App extends Component {
  state = {
    items: localStorage.find('items') || [],
    total: localStorage.find('total') || 0,
    modal: false,
    edit: false,
    settings: false,
    selected: null,
    added: 0,
    network: true,
  };

  componentDidMount() {
    window.addEventListener('online', this.network);
    window.addEventListener('offline', this.network);
    this.network();
  }

  network = () => {
    this.setState({ network: navigator.onLine });
  };

  edit = selected => {
    this.setState({
      modal: true,
      edit: true,
      settings: false,
      selected: selected.type !== 'click' ? selected : null,
    });
  };

  settings = () => {
    this.setState({
      modal: true,
      settings: true,
      edit: false,
    });
  };

  close = () => {
    this.setState({
      modal: false,
    });
  };

  loadImage = (item, update) => {
    serviceWorker.message(
      {
        type: 'insert',
        value: `${window.location.href}image/${btoa(update.src)}`,
      },
      value => {
        update.size = value.length;
        this.update(item.key, update);
      },
      error => {
        this.update(item.key, update);
      }
    );
  };

  insert = (key, update) => {
    const { items } = this.state;

    if (update.src === '') {
      const rand = window.devicePixelRatio * 200 + Math.random() * 200;
      update.src = `https://picsum.photos/${rand}/${rand}`;
    }

    const item = {
      ...update,
      key: key !== null ? key : Math.random(),
      size: 0,
    };

    if (window.sw) item.src = null;
    if (key === null) items.push(item);
    if (window.sw) this.loadImage(item, update);

    this.save(items);
  };

  update = (key, update) => {
    this.save(
      this.state.items.map(item => {
        if (item.key === key) Object.assign(item, update);
        return item;
      })
    );
  };

  remove = ({ src, key }) => {
    if (window.sw) {
      serviceWorker.message({
        type: 'remove',
        value: `${window.location.href}image/${src}`,
      });
    }
    this.save(this.state.items.filter(item => item.key !== key));
  };

  save = (items, modal = false) => {
    const total = items.reduce((acc, { size }) => acc + size, 0);
    this.setState({
      items,
      total,
      modal,
      added: this.state.added + 1,
    });
    localStorage.insert('items', items);
    localStorage.insert('total', total);
  };

  clear = () => {
    if (window.sw) {
      serviceWorker.message({
        type: 'removeAll',
      });
    }
    this.save([], true);
  };

  render() {
    const { items, selected, edit, total, settings, modal, added, network } = this.state;
    return (
      <div id="app">
        <Toolbar settings={this.settings} open={modal && settings} />
        <List items={items} count={items.length} edit={this.edit} added={added} />
        <Modal modal={this.state.edit && network === false ? false : modal} close={this.close}>
          {this.state.edit ? (
            <Form
              selected={selected}
              edit={edit}
              close={this.close}
              insert={this.insert}
              update={this.update}
              remove={this.remove}
            />
          ) : (
            <Settings total={total} clear={this.clear} />
          )}
        </Modal>
        <button
          class={`float ${network === false || modal ? 'hidden' : ''}`}
          onClick={this.edit}
          role="button"
          aria-label="add image"
        >
          Add image
        </button>
      </div>
    );
  }
}

export default App;
