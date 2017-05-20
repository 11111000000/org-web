import React, { Component } from 'react';
import TitleLine from './title_line';
import HeaderContent from './header_content';
import withPressureWrapper from './pressure_wrapper';
import { rgbaObject, rgbaString } from '../lib/color';

class Header extends Component {
  render() {
    const { header, force, color, setHeaderRef } = this.props;

    let backgroundColor = rgbaObject(255, 255, 255, 0);
    if (header.selected) {
      backgroundColor = rgbaObject(239, 255, 0, 0.28);
    }

    let style = {
      paddingLeft: 20 * header.nestingLevel,
      marginBottom: 2,
      marginTop: this.props.headerSpacing === 'Cozy' ? 5 : 25,
      paddingTop: 5,
      backgroundColor: rgbaString(backgroundColor),
      position: 'relative',
      overflowY: 'hidden'
    };

    const radius = ((window.innerWidth * 1.1) / 2) * this.props.force;
    const pressureIndicatorStyle = {
      position: 'absolute',
      width: radius * 2,
      height: radius * 2,
      backgroundColor: 'rgba(239, 255, 0, 0.28)',
      borderRadius: '50%',
      left: `calc(50% - ${radius}px)`,
      top: `calc(50% - ${radius}px)`,
      zIndex: -1
    };

    return (
      <div className="org-header"
           ref={setHeaderRef}
           style={style}>
        <div style={pressureIndicatorStyle}></div>
        <div style={{marginLeft: -16}}>
          {this.props.bulletStyle === 'Fancy' ? '●' : '*'}
        </div>
        <TitleLine headerId={header.headerId}
                   title={header.title}
                   rawTitle={header.rawTitle}
                   todoKeyword={header.todoKeyword}
                   tags={header.tags}
                   opened={header.opened}
                   hasContent={header.hasContent}
                   editMode={header.titleEditMode}
                   color={color}
                   force={force} />
        <HeaderContent headerId={header.headerId}
                       opened={header.opened}
                       description={header.description}
                       rawDescription={header.rawDescription}
                       editMode={header.descriptionEditMode} />
      </div>
    );
  }
};

export default withPressureWrapper(Header);
