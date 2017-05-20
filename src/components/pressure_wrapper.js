import React, { Component } from 'react';
import Pressure from 'pressure';

const withPressureWrapper = (WrappedComponent, wrapperStyle) => {
  return class extends Component {
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
      }, {polyfill: false});
    }

    render() {
      return (
        <div ref={containerDiv => this.containerDiv = containerDiv} style={wrapperStyle}>
          <WrappedComponent force={this.state.force}
                            deepPressActive={this.state.deepPressActive}
                            {...this.props} />
        </div>
      );
    }
  };
};

export default withPressureWrapper;
