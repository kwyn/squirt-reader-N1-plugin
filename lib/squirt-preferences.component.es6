import { React } from 'nylas-exports';
import SquirtStore from './squirt.store';
import _ from 'lodash';

export default class SquirtPreferences extends React.Component {
  static displayName = 'SquirtPreferences'

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      defaultWpm: SquirtStore.getDefaultWpm(),
      threshold: SquirtStore.getThreshold(),
      showErrors: SquirtStore.getShowErrors(),
    });
  }
  render() {
    let textBoxStyle = {
      width: '25%',
      minWidth: '75px',
    };
    const textBoxLabelStyle = {
      maxWidth: '75%'
    };
    let wpmError = null;
    let thresholdError = null;

    if (this.state.wpmError) {
      wpmError = <div class="squirt-container-error"> {this.state.wpmError} </div>
    }

    if (this.state.thresholdError) {
      thresholdError = <div class="squirt-container-error"> {this.state.wpmError} </div>
    }

    return <div className="container-general">
      <section>
        <div class="item">
          {wpmError}
          <label
           for="default-wpm"
           style={textBoxLabelStyle}>Default words per minute </label>
          <input
           id="default-wpm"
           type="text"
           value={this.state.defaultWpm}
           style={textBoxStyle}
           onChange={this::this._updateDefaultWPM}/>
        </div>
        <div class="item">
          {thresholdError}
          <label
          for="threshold"
          style={textBoxLabelStyle}>Minimum word count threshold to display reader.  </label>
          <input
           id="threshold"
           type="text"
           style={textBoxStyle}
           value={this.state.threshold}
           onChange={this::this._updateThreshold}/>
        </div>
        <div class="item">
          <input id="display-error-when-no-text-found"
           type="checkbox"
           checked={this.state.showErrors}
           onChange={this::this._updateShowErrors}/>
          <label for="wpm-default">  Display errors for e-mails where text can not be parsed</label>
        </div>
      </section>
    </div>
  }
  _updateDefaultWPM(event) {
    const stringValue = _.get(event, 'target.value');
    const value = _.parseInt(stringValue, 10);
    if (value === NaN || stringValue == "") {
      this.setState({
        wpmError: "Please enter a number for word per minut default",
        defaultWpm: stringValue,
     });
    } else {
      this.state.wpmError = false;
      SquirtStore.setDefaultWpm(value)
      this.setState({defaultWpm: SquirtStore.getDefaultWpm()});
    }
  }
  _updateThreshold(event) {
    const stringValue = _.get(event, 'target.value');
    const value = _.parseInt(stringValue, 10);
    if (value === NaN || stringValue == "") {
      this.setState({
        thresholdError: "Please enter a number for the minimum word count threshold",
        threshold: stringValue,
      });
    } else {
      this.state.thresholdError = false;
      SquirtStore.setThrehold(value)
      this.setState({threshold: SquirtStore.getThreshold()});
    }
  }
  _updateShowErrors(event) {
    SquirtStore.setShowErrors(!this.state.showErrors);
    this.setState({showErrors: SquirtStore.getShowErrors()});
  }
}
