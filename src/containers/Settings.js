import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';


import NotificationSection from '../components/Settings/NotificationSection';
// import EasyAPIBackupSection from '../components/Settings/EasyAPIBackupSection';
import VersionSection from '../components/Settings/VersionSection';
import SocialSection from '../components/Settings/SocialSection';
import packageJSON from '../../package.json';

import {
  FETCH_REMOTE_VERSION,
  SEND_REMOTE_VERSION,
  OPEN_URL,
} from '../../utils/constants';

const settingsTitleStyle = {
  fontSize: 14,
};
const wrapperStyle = {
  paddingTop: 5,
  paddingBottom: 5,
};
const h2Style = {
  fontSize: 10,
  fontFamily: 'sans-serif',
  fontWeight: 200,
  paddingBottom: 3,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderStyle: 'solid',
  borderColor: '#d8d8d8',
};
const backBtnWrapperStyle = {
  paddingBottom: 10,
};
const backBtnStyle = {
  fontSize: 10,
};

// TODO -  Move to /utils/common
const getDefaultNotificationSettings = () => {
  return {
    onDisconnect: false,
    every5min: false,
    every20min: false,
    every1Hour: false,
  };
}

/*
<EasyAPIBackupSection
  wrapperStyle={wrapperStyle}
  h2Style={h2Style}
/>
*/

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      remoteVersion: null,
    };

    this.fetchRemoteVersion = this.fetchRemoteVersion.bind(this);
    this.handleFetchRemotePackage = this.handleFetchRemotePackage.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.openURL = this.openURL.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(SEND_REMOTE_VERSION, this.handleFetchRemotePackage);

    this.fetchRemoteVersion();
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(SEND_REMOTE_VERSION, this.handleFetchRemotePackage);
  }

  openURL(url) {
    ipcRenderer.send(OPEN_URL, url);
  }

  fetchRemoteVersion() {
    ipcRenderer.send(FETCH_REMOTE_VERSION, 'ping');
  }

  handleFetchRemotePackage(event, data) {
    const {
      remotePackage,
    } = data;
    if (remotePackage) {
      const {
        version,
      } = remotePackage;
      this.setState({
        remoteVersion: version,
      });
    }
  }

  onCheckboxChange(event, key) {
    const {
      appData,
      updateAppData,
    } = this.props;

    if (!appData.notifications) {
      appData.notifications = getDefaultNotificationSettings();
    }

    appData.notifications[key] = !appData.notifications[key];

    if (key) {
      updateAppData(appData);
    }
  }

  render() {
    const {
      toggleSettings,
      appData,
    } = this.props;
    const {
      version
    } = packageJSON;
    const {
      remoteVersion,
    } = this.state;
    let {
      notifications,
    } = appData;

    if (!notifications) {
      notifications = getDefaultNotificationSettings();
    }

    return (
      <div>
        <div style={backBtnWrapperStyle}>
          <button style={backBtnStyle} onClick={toggleSettings}>Back</button>
        </div>
        <h1 style={settingsTitleStyle}>Settings</h1>
        <NotificationSection
          wrapperStyle={wrapperStyle}
          h2Style={h2Style}
          notifications={notifications}
          onCheckboxChange={this.onCheckboxChange}
        />
        <VersionSection
          wrapperStyle={wrapperStyle}
          h2Style={h2Style}
          currentVersion={packageJSON.version}
          remoteVersion={remoteVersion}
        />
        <SocialSection
          wrapperStyle={wrapperStyle}
          h2Style={h2Style}
          openURL={this.openURL}
        />
      </div>
    );
  }
}

Settings.propTypes = {
  toggleSettings: PropTypes.func.isRequired,
  updateAppData: PropTypes.func.isRequired,
  appData: PropTypes.object,
};

export default Settings;
