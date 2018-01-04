import React from 'react';
import PropTypes from 'prop-types';

const labelStyle=  {
  width: '100%',
  display: 'inherit',
  fontSize: 10,
  fontFamily: 'sans-serif',
};

const NotificationItem = (props) => (
  <label style={labelStyle}>
    <input type="checkbox" checked={props.isChecked} onChange={(e) => props.onCheckboxChange(e, props.objectKey)} />
    {props.text}
  </label>
);

NotificationItem.propTypes = {
  text: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
};

export default NotificationItem;
