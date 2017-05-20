import React, { Component } from 'react';
import ActionButton from './action_button';
import PressureWrapper from './pressure_wrapper';

class PressureActionButton extends Component {
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
    const wrapperStyle = {
      display: 'inline-block'
    };

    return (
      <PressureWrapper style={wrapperStyle}>
        {(force, deepPressActive) => (
          <div style={{position: 'relative'}}>
            <ActionButton {...this.props} />
            <div style={this.styleWithForce(force)}></div>
          </div>
        )}
      </PressureWrapper>
    );
  }
}

export default PressureActionButton;
