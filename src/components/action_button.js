import React, { Component } from 'react';

class ActionButton extends Component {
  render() {
    const disabledClass = this.props.disabled ? 'btn--disabled' : '';

    return (
      <button className={`fa fa-${this.props.icon} btn btn--circle ${disabledClass}`}
              style={{marginRight: 20}}
              onClick={() => this.props.onClick()} />
    );
  }
};

export default ActionButton;
