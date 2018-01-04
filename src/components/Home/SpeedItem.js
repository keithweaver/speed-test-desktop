import React from 'react';
import PropTypes from 'prop-types';

const wrapperStyle = {
  width: '100%',
};
const titleStyle = {
  fontSize: 10,
  fontFamily: 'sans-serif',
  color: '#D8D8D8',
};
const speedTextStyle = {
  fontSize: 24,
  fontFamily: 'sans-serif',
};
const speedTypeTextStyle = {
  fontSize: 8,
  paddingLeft: 3,
};

const trimSpeed = (str) => {
  if (str.toString().indexOf('.') !== -1) {
    // Has decimal
    const parts = str.toString().split('.');
    if (parts[0].length > 2) {
      return parts[0];
    } else if (parts[1].length > 2) {
      return `${parts[0]}.${parts[1].substring(0, 2)}`;
    }
    return str;
  } else {
    return str;
  }
}

const SpeedItem = props => (
  <div style={wrapperStyle}>
    <p style={titleStyle}>{props.title}</p>
    <p style={speedTextStyle}>
      {
        (props.speed) ? (
          trimSpeed(props.speed)
        ) : ('-')
      } 
      {
        (props.unit) ? (
          <span style={speedTypeTextStyle}>{props.unit}</span>
        ) : (null)
      }
    </p>
  </div>
);

SpeedItem.propTypes = {
  title: PropTypes.string.isRequired,
  speed: PropTypes.number,
  unit: PropTypes.string,
};

SpeedItem.defaultProps = {
  unit: null,
  speed: null,
};

export default SpeedItem;