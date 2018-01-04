import React from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';

const wrapperStyle = {
  textAlign: 'left',
  cursor: 'pointer',
};
const iconStyle = {
  height: 10,
  width: 10,
  display: 'inline-block',
  top: 2,
  position: 'relative',
  borderRadius: '50%',
};
const textStyle = {
  fontSize: 10,
  display: 'inline-block',
  paddingLeft: 5,
  fontFamily: 'sans-serif',
  color: '#A4A4A4',
};

const StatusCheckItem = props => (
  <div style={wrapperStyle} onClick={props.onClick}>
    <div style={objectAssign({}, iconStyle, { backgroundColor: props.color })} />
    <p style={textStyle}>{props.text}</p>
  </div>
);

StatusCheckItem.propTypes = {
  text: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default StatusCheckItem;
