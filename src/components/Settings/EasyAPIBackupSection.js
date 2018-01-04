import React from 'react';
import PropTypes from 'prop-types';

const EasyAPIBackupSection = (props) => (
  <div style={props.wrapperStyle}>
    <h2 style={props.h2Style}>Record on EasyAPI</h2>
    <p>Your API Key:</p>
    <input type="text" />
    <p>Your App Id:</p>
    <input type="text" />
    <div>
      <button>Save</button>
    </div>
  </div>
);

EasyAPIBackupSection.propTypes = {
  h2Style: PropTypes.object,
  wrapperStyle: PropTypes.object,
};

export default EasyAPIBackupSection;
