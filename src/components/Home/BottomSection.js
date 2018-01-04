import React from 'react';
import PropTypes from 'prop-types';

import StatusChecks from './StatusChecks';
import SpeedItem from './SpeedItem';

const wrapperStyle = {
  textAlign: 'center',
};


const BottomSection = props => (
  <div style={wrapperStyle}>
    <SpeedItem
      title="Download"
      speed={props.download}
      unit={props.downloadUnit}
    />
    <SpeedItem
      title="Upload"
      speed={props.upload}
      unit={props.uploadUnit}
    />
    <StatusChecks
      checks={props.checks}
    />
  </div>
);

BottomSection.propTypes = {
  download: PropTypes.number,
  downloadUnit: PropTypes.string,
  upload: PropTypes.number,
  uploadUnit: PropTypes.string,
  checks: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
  })),
};

BottomSection.defaultProps = {
  download: null,
  downloadUnit: null,
  upload:  null,
  uploadUnit: null,
  checks: [],
};

export default BottomSection;
