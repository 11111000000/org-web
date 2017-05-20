import React, { Component } from 'react';

class ActionButton extends Component {
  render() {
    const {disabled, icon, onClick} = this.props;

    const disabledClass = disabled ? 'btn--disabled' : '';

    return (
      <button className={`fa fa-${icon} btn btn--circle ${disabledClass}`}
              style={{marginRight: 20}}
              onClick={onClick} />
    );
  }
};

export default ActionButton;
