import React from 'react';
import PropTypes from 'prop-types';

const socialBtnStyle = {
  width: '100%',
  textDecoration: 'none',
  color: '#A4A4A4',
  paddingTop: 6,
  paddingBottom: 6,
  fontFamily: 'sans-serif',
  fontSize: 10,
  display: 'inherit',
  textAlign: 'center',
  borderWidth: 0,
  backgroundColor: 'rgba(0,0,0,0)',
};

const SocialSection = (props) => (
  <div style={props.wrapperStyle}>
    <h2 style={props.h2Style}>Social</h2>
    <button onClick={() => props.openURL('https://github.com/EasyAPIio/speed-test-desktop')} style={socialBtnStyle}>
      View on Github
    </button>
    <button onClick={() => props.openURL('https://twitter.com/keithweaver_')} style={socialBtnStyle}>
      View on Twitter
    </button>
  </div>
);

SocialSection.propTypes = {
  h2Style: PropTypes.object,
  wrapperStyle: PropTypes.object,
};

export default SocialSection;
