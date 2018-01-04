import React from 'react';
import PropTypes from 'prop-types';

import settingsIcon from '../../assets/imgs/settings.png';

const wrapperStyle = {
  textAlign: 'right',
};
const settingsIconBtnStyle = {
  backgroundColor: 'rgba(0,0,0,0)',
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  borderWidth: 0,
};
const settingsIconStyle = {
  height: 15,
};

const TopSection = props => (
  <div style={wrapperStyle}>
    <button style={settingsIconBtnStyle} onClick={props.toggleSettings}>
      <img src={settingsIcon} style={settingsIconStyle} />
    </button>
  </div>
);

TopSection.propTypes = {
  toggleSettings: PropTypes.func.isRequired,
};

export default TopSection;
