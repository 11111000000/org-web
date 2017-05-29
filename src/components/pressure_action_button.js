import React, { PureComponent } from 'react';
import ActionButton from './action_button';
import withPressureWrapper from './pressure_wrapper';

class PressureActionButton extends PureComponent {
  componentWillReceiveProps(newProps) {
    if (newProps.deepPressActive && !this.props.deepPressActive) {
      this.props.onDeepPressStart();
    }
  }

  render() {
    const { force, subActionsVisible, children } = this.props;

    const radius = window.innerWidth * 1.8 * force;
    const opacity = 1.0 - 0.5 * force;

    const pressureIndicatorStyle = {
      position: 'absolute',
      backgroundColor: '#3d696a',
      width: radius * 2,
      height: radius * 2,
      borderRadius: '50%',
      left: `calc(50% - ${radius}px - 10px)`,
      top: `calc(50% - ${radius}px)`,
      opacity
    };

    return (
      <div style={{position: 'relative'}}>
        <ActionButton {...this.props} />
        {!subActionsVisible && <div style={pressureIndicatorStyle}></div>}
        {subActionsVisible && children}
      </div>
    );
  }
}

export default withPressureWrapper(PressureActionButton, {display: 'inline-block'});
