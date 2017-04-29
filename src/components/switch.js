import React, { Component } from 'react';
import { Motion, spring } from 'react-motion';
import '../stylesheets/switch.css';

class Switch extends Component {
  render() {
    const enabledColor = {
      r: 59,
      g: 105,
      b: 106
    };

    const switchStyle = {
      colorFactor: spring(this.props.enabled ? 0 : 1, {stiffness: 300})
    };
    const grabberStyle = {
      marginLeft: spring(this.props.enabled ? 42 : 0, {stiffness: 300})
    };

    return (
      <Motion style={switchStyle}>
        {style => {
          const rgb = {
            r: parseInt((255 - enabledColor.r) * style.colorFactor + enabledColor.r, 10),
            g: parseInt((255 - enabledColor.g) * style.colorFactor + enabledColor.g, 10),
            b: parseInt((255 - enabledColor.b) * style.colorFactor + enabledColor.b, 10)
          };
          return (
            <div className={`switch`}
                 style={{backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`}}
                 onClick={() => this.props.toggle()}>
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
