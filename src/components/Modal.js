import { h, Component } from 'preact';

import './../styling/modal.css';

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 27) this.props.close();
    });
  }

  render() {
    const { modal, close, children } = this.props;
    return (
      <div>
        <div class={`background ${modal ? 'active' : ''}`} onClick={close} />
        <div class={`modal ${modal ? 'active' : ''}`}>{children}</div>
      </div>
    );
  }
}

export default Modal;
