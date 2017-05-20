import React, { Component } from 'react';
import ActionButton from './action_button';
import withPressureWrapper from './pressure_wrapper';

class PressureActionButton extends Component {
  componentWillReceiveProps(newProps) {

  }

  styleWithForce(force) {
    const radius = (window.innerWidth * 1.1) * force;
    const opacity = 1.0 - 0.5 * force;

    return {
      position: 'absolute',
      backgroundColor: '#3d696a',
      width: radius * 2,
      height: radius * 2,
      borderRadius: '50%',
      left: `calc(50% - ${radius}px - 10px)`,
      top: `calc(50% - ${radius}px)`,
      opacity
    };
  }

  render() {
    return (
      <div style={{position: 'relative'}}>
        <ActionButton {...this.props} />
        <div style={this.styleWithForce(this.props.force)}></div>
      </div>
    );
  }
}

export default withPressureWrapper(PressureActionButton, {display: 'inline-block'});
