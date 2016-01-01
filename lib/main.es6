// Squirt Reader
import {
  React,
  ComponentRegistry,
  MessageStore,
  Message,
  Actions,
  FocusedContentStore} from 'nylas-exports';
import _ from 'lodash';

import SquirtParser from './squirt-parser';
import SquirtStore from './squirt.store';
class SquirtReader extends React.Component {
  static displayName = 'SquirtReader'

  static propTypes = {
    message: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.parser = new SquirtParser();
  }


  componentWillMount() {
    this.setState({error: null, node: null})
  }

  componentDidMount() {
    const self = this;
    this._storeUnlisten = SquirtStore.listen(this::this._squirtStoreChange);
    this.parser
      .parse(this.props.message.body)
      .then(::this.parser.buildNodes)
      .then(::SquirtStore.setNodes)
      .then(::SquirtStore.play)
      .catch((error) => {
        // TODO: Set error message
        // console.error(error);
        self.setState({error: error, node: null});
      });
  }

  render() {
    if (this.state.error) {
      return <div className="phishingIndicator error">{this.state.error.message}</div>
    }

    if (!this.state.node) {
      // TODO: display controlls
      return null;
    }
    return <div className="phishingIndicator">
      <span className="squirt_start">{this.state.node.start}</span>
      <span className="squirt_ORP">{this.state.node.ORP}</span>
      <span className="squirt_end">{this.state.node.end}</span>
    </div>
  }

  _squirtStoreChange(messageId, state) {
    this.setState({error: null, node: state})
  }
}

// Activate is called when the package is loaded. If your package previously
// saved state using `serialize` it is provided.
//
export function activate(state) {
  ComponentRegistry.register(SquirtReader, { role: 'message:BodyHeader' });
}

// Serialize is called when your package is about to be unmounted.
// You can return a state object that will be passed back to your package
// when it is re-activated.
export function serialize() {
}

// This **optional** method is called when the window is shutting down,
// or when your package is being updated or disabled. If your package is
// watching any files, holding external resources, providing commands or
// subscribing to events, release them here.
export function deactivate() {
  PreferencesUIStore.unregisterPreferencesTab(_tab.tabId);

  ExtensionRegistry.MessageView.unregister(MessageLoaderExtension);
  ComponentRegistry.unregister(ComposerLoader)
  ComponentRegistry.unregister(MessageLoaderHeader)
}
