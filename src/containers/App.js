import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

import Settings from './Settings';
import BottomSection from '../components/Home/BottomSection';
import TopSection from '../components/Home/TopSection';

import {
  FETCH_INTERNET_SPEEDS,
  FETCH_INTERNET_SPEEDS_DATA,
  FETCH_INTERNET_SPEEDS_DOWNLOAD_PROGRESS,
  FETCH_INTERNET_SPEEDS_UPLOAD_PROGRESS,
  FETCH_INTERNET_SPEEDS_ERROR,
  SPEED_TEST_DESKTOP_DATA_SEND,
  SPEED_TEST_DESKTOP_DATA_WATCH,
  SPEED_TEST_DESKTOP_DATA_SAVE,
  RECEIVE_TIMER,
} from '../../utils/constants';

import '../assets/css/App.css';

const TEST_FAILED_COLOR = '#B40431';
const TEST_PASSED_COLOR = '#088A08';
const TEST_PENDING_COLOR = '#FF8000';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSettings: false,
      isTestingWSpeedTestNet: true,
      speedTestNetDownloadProgress: 0,
      speedTestNetUploadProgress: 0,
      speedTestNetData: 0,
      speedTestNetError: null,
      appData: null,
    };

    this.fetchInternetSpeeds = this.fetchInternetSpeeds.bind(this);
    this.handleFetchInternetSpeedsData = this.handleFetchInternetSpeedsData.bind(this);
    this.handleFetchInternetSpeedsDownloadProgress = this.handleFetchInternetSpeedsDownloadProgress.bind(this);
    this.handleFetchInternetSpeedsUploadProgress = this.handleFetchInternetSpeedsUploadProgress.bind(this);
    this.handleFetchInternetSpeedsError = this.handleFetchInternetSpeedsError.bind(this);

    this.fetchAppData = this.fetchAppData.bind(this);
    this.handleFetchAppData = this.handleFetchAppData.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.saveAppData = this.saveAppData.bind(this);
    this.updateAppData = this.updateAppData.bind(this);

    this.restartTimers = this.restartTimers.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(FETCH_INTERNET_SPEEDS_DATA, this.handleFetchInternetSpeedsData);
    ipcRenderer.on(FETCH_INTERNET_SPEEDS_DOWNLOAD_PROGRESS, this.handleFetchInternetSpeedsDownloadProgress);
    ipcRenderer.on(FETCH_INTERNET_SPEEDS_UPLOAD_PROGRESS, this.handleFetchInternetSpeedsUploadProgress);
    ipcRenderer.on(FETCH_INTERNET_SPEEDS_ERROR, this.handleFetchInternetSpeedsError);
    ipcRenderer.on(SPEED_TEST_DESKTOP_DATA_SEND, this.handleFetchAppData);

    this.fetchInternetSpeeds();
    this.fetchAppData();
  }

  restartTimers() {
    const {
      appData,
    } = this.state;
    const {
      notifications,
    } = appData;
    ipcRenderer.send(RECEIVE_TIMER, notifications);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(FETCH_INTERNET_SPEEDS_DATA, this.handleFetchInternetSpeedsData);
    ipcRenderer.removeListener(FETCH_INTERNET_SPEEDS_DOWNLOAD_PROGRESS, this.handleFetchInternetSpeedsDownloadProgress);
    ipcRenderer.removeListener(FETCH_INTERNET_SPEEDS_UPLOAD_PROGRESS, this.handleFetchInternetSpeedsUploadProgress);
    ipcRenderer.removeListener(FETCH_INTERNET_SPEEDS_ERROR, this.handleFetchInternetSpeedsError);
    ipcRenderer.removeListener(SPEED_TEST_DESKTOP_DATA_SEND, this.handleFetchAppData);
  }

  fetchInternetSpeeds() {
    this.setState({
      isTestingWSpeedTestNet: true,
    });
    ipcRenderer.send(FETCH_INTERNET_SPEEDS, 'ping');
  }

  handleFetchInternetSpeedsData(event, data) {
    this.setState({
      speedTestNetData: data,
      isTestingWSpeedTestNet: false,
    });
  }

  handleFetchInternetSpeedsDownloadProgress(event, data) {
    const { progress } = data;

    this.setState({
      speedTestNetDownloadProgress: progress,
    });
  }

  handleFetchInternetSpeedsUploadProgress(event, data) {
    const { progress } = data;

    this.setState({
      speedTestNetUploadProgress: progress,
    });
  }

  handleFetchInternetSpeedsError(event, data) {
    this.setState({
      speedTestNetError: data,
    });
  }

  toggleSettings() {
    const {
      showSettings,
    } = this.state;
    this.setState({
      showSettings: !showSettings,
    });
  }

  fetchAppData() {
    console.log('fetchAppData');
    ipcRenderer.send(SPEED_TEST_DESKTOP_DATA_WATCH, 'ping');
  }

  handleFetchAppData(event, response) {
    const {
      data,
    } = response;

    console.log('handleFetchAppData', data);
    this.setState({
      appData: data,
    });

    this.restartTimers();
  }

  saveAppData() {
    console.log('saveAppData');
    const {
      appData,
    } = this.state;
    console.log('appData', appData);
    ipcRenderer.send(SPEED_TEST_DESKTOP_DATA_SAVE, appData);
    this.restartTimers();
  }

  updateAppData(data) {
    console.log('updateAppData', data);
    this.setState({
      appData: data,
    });

    this.saveAppData();
  }

  render() {
    const {
      speedTestNetData,
      isTestingWSpeedTestNet,
      speedTestNetError,
      showSettings,
      appData,
    } = this.state;

    if (showSettings) {
      return (
        <Settings
          toggleSettings={this.toggleSettings}
          appData={appData}
          updateAppData={this.updateAppData}
        />
      );
    }

    // Get download and upload speed
    let download = null;
    let upload = null;
    let unit = null;
    if (speedTestNetData && speedTestNetData.speeds) {
      upload = speedTestNetData.speeds.upload;
      download = speedTestNetData.speeds.download;
      unit = "MBPS";
    }

    // Determine speed test net color
    let speedTestNetColor = TEST_PENDING_COLOR;
    if (speedTestNetError) {
      speedTestNetColor = TEST_FAILED_COLOR;
    } else if (!isTestingWSpeedTestNet) {
      speedTestNetColor = TEST_PASSED_COLOR;
    }

    const checks = [
      {
        text: 'Speedtest.net',
        isLoading: false,
        color: speedTestNetColor,
        onClick: this.fetchInternetSpeeds,
      }
    ];

    return (
      <div>
        <TopSection
          toggleSettings={this.toggleSettings}
        />
        <BottomSection
          download={download}
          downloadUnit={unit}
          upload={upload}
          uploadUnit={unit}
          checks={checks}
        />
      </div>
    );
  }
}

export default App;
