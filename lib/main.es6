// Squirt Reader
import {
  React,
  ReactDOM,
  ComponentRegistry,
  MessageStore,
  PreferencesUIStore,
  Message,
  Actions,
  FocusedContentStore} from 'nylas-exports';
import _ from 'lodash';

import SquirtParser from './squirt-parser';
import SquirtStore from './squirt.store';
import SquirtNode from './squirt-node.component';
import SquirtControls from './squirt-controls.component';
import SquirtPreferences from './squirt-preferences.component';

class SquirtReader extends React.Component {
  static displayName = 'SquirtReader'

  static propTypes = {
    message: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.parser = new SquirtParser();
    this.calculatedOffset = 0;
    this.showReader = false;
  }

  componentWillMount() {
    this.setState({
      ready: false,
      error: null,
      node: null,
      showErrors: SquirtStore.getShowErrors(),
    });
    // Set default wpm on component mount
    SquirtStore.setWpm(SquirtStore.getDefaultWpm());
  }

  componentDidMount() {
    const self = this;
    this._storeUnlisten = SquirtStore.listen(this::this._squirtStoreChange);
    this.parser
      .parse(this.props.message.body)
      .then(::this.parser.buildNodes)
      .then(::SquirtStore.setNodes)
      // .then(::SquirtStore.play)
      .catch((error) => {
        console.error(error);
        self.setState({error: error, node: null, ready: false});
      });
  }

  componentWillUnmount() {
    SquirtStore.clearTimeouts();
    SquirtStore.pause();
    if (this._storeUnlisten) {
      this._storeUnlisten();
    }
  }

  render() {
    // Don't display anything if e-mail is below the threshold
    if (this.state.belowThrehold) {
      return null;
    }
    let readerStyles = { visibilitity: 'hidden'};
    let widgetStyles = { 'minHeight': '2em'};

    if (this.state.error) {
      if (this.state.showErrors){
        return <div
            className="squirt__container error"
            style={widgetStyles}>
            {this.state.error.message}
          </div>
      }
      return null;
    }

    if (!this.state.ready) {
      return <div
          className="squirt__container info"
          style={widgetStyles}>Parsing Text ...</div>;
    }

    let reader = null;

    if (this.state.showReader) {
      widgetStyles.height = '8em';
      reader = <div className="squirt__reader">
          <div className="squirt__reader-space"/>
          <SquirtNode node={this.state.node} />
        </div>;
    }

    return <div className="squirt__container" style={widgetStyles}>
        <SquirtControls/>
         {reader}
      </div>
  }

  _squirtStoreChange(messageId, state) {
    if (messageId === 'squirt.play') {
      this.setState({showReader: true});
    }
    if (messageId === 'squirt.nextWord') {
      this.setState({error: null, node: state, ready: true});
    }
    if (messageId === 'squirt.ready') {
      this.setState({
        error: null,
        node: {},
        ready: true ,
        belowThrehold: SquirtStore.isBelowThreshold()
      });
    }
  }
}

// Activate is called when the package is loaded. If your package previously
// saved state using `serialize` it is provided.
//
export function activate(state) {
  SquirtStore.init(state);
  ComponentRegistry.register(SquirtReader, { role: 'message:BodyHeader' });
  this.preferencesTab = new PreferencesUIStore.TabItem({
    tabId: 'SquirtPreferences',
    displayName: 'Squirt Preferences',
    component: SquirtPreferences,
  });
  PreferencesUIStore.registerPreferencesTab(this.preferencesTab)
}

// Serialize is called when your package is about to be unmounted.
// You can return a state object that will be passed back to your package
// when it is re-activated.
export function serialize() {
  return SquirtStore.serialize();
}

// This **optional** method is called when the window is shutting down,
// or when your package is being updated or disabled. If your package is
// watching any files, holding external resources, providing commands or
// subscribing to events, release them here.
export function deactivate() {
  PreferencesUIStore.unregisterPreferencesTab(this.preferencesTab.tabId);
  ComponentRegistry.unregister(SquirtReader);
}
