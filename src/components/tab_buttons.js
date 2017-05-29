import React, { PureComponent } from 'react';
import '../stylesheets/tab_buttons.css';

class TabButtons extends PureComponent {
  render() {
    const buttons = this.props.buttons.map((title, index) => {
      let className = 'tab-buttons__button';
      if (this.props.selected === title || (!this.props.selected && index === 0)) {
        className += ' tab-buttons__button--selected';
      }

      return (
        <div className={className}
             key={title}
             onClick={() => this.props.buttonSelected(title)}>
          {title}
        </div>
      );
    });

    return (
      <div className="tab-buttons">
        {buttons}
      </div>
    );
  }
};

export default TabButtons;
