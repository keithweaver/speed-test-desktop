import React from 'react';
import PropTypes from 'prop-types';

const versionLabel = {
  fontSize: 10,
  fontFamily: 'sans-serif',
  paddingTop: 5,
};
const versionText = {
  fontSize: 11,
  fontFamily: 'sans-serif',
};

const VersionSection = (props) => (
  <div style={props.wrapperStyle}>
    <h2 style={props.h2Style}>Version</h2>
    <p style={versionLabel}>Your version:</p>
    <p style={versionText}>{props.currentVersion}</p>
    <p style={versionLabel}>Newest version:</p>
    <p style={versionText}>{props.remoteVersion}</p>
  </div>
);

VersionSection.propTypes = {
  h2Style: PropTypes.object,
  wrapperStyle: PropTypes.object,
  currentVersion: PropTypes.string,
  remoteVersion: PropTypes.string,
};

VersionSection.defaultProps = {
  h2Style: null,
  wrapperStyle: null,
  currentVersion: '',
  remoteVersion: '',
};

export default VersionSection;