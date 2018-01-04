import React from 'react';
import PropTypes from 'prop-types';

import NotificationItem from './NotificationItem';

const NotificationSection = (props) => (
  <div style={props.wrapperStyle}>
    <h2 style={props.h2Style}>Notifications</h2>
    <NotificationItem
      isChecked={props.notifications.onDisconnect}
      text="On disconnect"
      onCheckboxChange={props.onCheckboxChange}
      objectKey="onDisconnect"
    />
    <NotificationItem
      isChecked={props.notifications.every5min}
      text="Speed every 5 minutes"
      onCheckboxChange={props.onCheckboxChange}
      objectKey="every5min"
    />
    <NotificationItem
      isChecked={props.notifications.every20min}
      text="Speed every 20 minutes"
      onCheckboxChange={props.onCheckboxChange}
      objectKey="every20min"
    />
    <NotificationItem
      isChecked={props.notifications.every1Hour}
      text="Speed every hour"
      onCheckboxChange={props.onCheckboxChange}
      objectKey="every1Hour"
    />
  </div>
);

NotificationSection.propTypes = {
  h2Style: PropTypes.object,
  wrapperStyle: PropTypes.object,
};

export default NotificationSection;
