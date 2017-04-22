import React, { Component } from 'react';
import '../stylesheets/switch.css';

class Switch extends Component {
  render() {
    return (
      <div className={`switch ${this.props.enabled && 'switch--enabled'}`}
           onClick={() => this.props.toggle()}>
        <div className={`switch__grabber ${this.props.enabled && 'switch__grabber--enabled'}`}></div>
      </div>
    );
  }
};

export default Switch;
