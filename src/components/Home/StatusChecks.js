import React from 'react';
import PropTypes from 'prop-types';

import StatusCheckItem from './StatusCheckItem';

const noTextStyle = {
  fontSize: 10,
  fontFamily: 'sans-serif',
  paddingTop: 10,
  paddingBottom: 5,
  color: '#E6E6E6',
};

const StatusChecks = props => (
  <div>
    {
      (props.checks) ? (
        props.checks.map(check => (
          <StatusCheckItem
            text={check.text}
            isLoading={check.isLoading}
            color={check.color}
            key={Math.random()}
            onClick={check.onClick}
          />
        ))
      ) : (
        <p style={noTextStyle}>No checks are running.</p>
      )
    }
  </div>
);

StatusChecks.propTypes = {
  checks: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    isLoading: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })),
};

StatusChecks.defaultProps = {
  checks: null,
};

export default StatusChecks;
