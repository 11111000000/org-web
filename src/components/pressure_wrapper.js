import React, { Component } from 'react';
import Pressure from 'pressure';

class PressureWrapper extends Component {
  constructor() {
    super();

    this.state = {
      force: 0,
      deepPressActive: false
    };
  }

  componentDidMount() {
    Pressure.set(this.containerDiv, {
      change: force => {
        this.setState({ force });
      },
      end: () => {
        this.setState({
          force: 0,
          deepPressActive: false
        });
      },
      startDeepPress: () => {
        this.setState({ deepPressActive: true });
      },
      endDeepPress: () => {
        this.setState({ deepPressActive: false });
      }
    });
  }

  render() {
    return (
      <div ref={containerDiv => this.containerDiv = containerDiv}>
        {this.props.children(this.state.force, this.state.deepPressActive)}
      </div>
    );
  }
};

export default PressureWrapper;
