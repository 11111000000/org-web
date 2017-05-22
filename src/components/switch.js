import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import { interpolateColors, rgbaObject, rgbaString } from '../lib/color';
import '../stylesheets/switch.css';

class Switch extends Component {
  render() {

    const disabledColor = rgbaObject(255, 255, 255, 1);
    const enabledColor = rgbaObject(59, 105, 106, 1);

    const switchStyle = {
      colorFactor: spring(this.props.enabled ? 1 : 0, {stiffness: 300})
    };
    const grabberStyle = {
      marginLeft: spring(this.props.enabled ? 42 : 0, {stiffness: 300})
    };

    return (
      <Motion style={switchStyle}>
        {style => {
          const rgba = interpolateColors(disabledColor, enabledColor, style.colorFactor);
          return (
            <div className={`switch`}
                 style={{backgroundColor: rgbaString(rgba)}}
                 onClick={this.props.toggle}>
              <Motion style={grabberStyle}>
                {style => <div className={`switch__grabber`} style={style}></div>}
              </Motion>
            </div>
          );
        }}
      </Motion>
    );
  }
};

export default Switch;
