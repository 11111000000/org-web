import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class ActionButton extends Component {
  componentDidMount() {
    // A hack to try to mimic the iOSy behavior of pressing the button that a deep press ends
    // on, instead of the button that the deep press began on. If a handlerName prop is
    // specified, add that as an attribute to the button DOM node, so that it can later be
    // pulled by an onTouchEnd handler.
    const { handlerName } = this.props;

    if (handlerName) {
      const buttonElement = ReactDOM.findDOMNode(this.button);
      buttonElement.setAttribute('handler-name', handlerName);
    }
  }

  render() {
    const {disabled, icon, onClick, onTouchEnd} = this.props;

    const disabledClass = disabled ? 'btn--disabled' : '';

    return (
      <button className={`fa fa-${icon} btn btn--circle ${disabledClass}`}
              style={{marginRight: 20}}
              onClick={onClick}
              ref={button => this.button = button}
              onTouchEnd={onTouchEnd ? onTouchEnd : () => {}} />
    );
  }
};

export default ActionButton;
