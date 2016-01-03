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
import SquirtNode from './squirt-node.component';
import SquirtControls from './squirt-controls.component';

class SquirtReader extends React.Component {
  static displayName = 'SquirtReader'

  static propTypes = {
    message: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.parser = new SquirtParser();
    this.calculatedOffset = 0;
  }

  componentWillMount() {
    this.setState({ready: false, error: null, node: null})
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
        // TODO: Set error message
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
    if (this.state.error) {
      return <div className="squirt__container error">{this.state.error.message}</div>
    }

    if (!this.state.ready) {
      // TODO: display controlls
      return <div className="squirt__container error">Parsing Text ...</div>;
    }

    return <div className="squirt__container">
        <SquirtControls/>
        <div className="squirt__reader">
          <SquirtNode node={this.state.node} />
        </div>
      </div>
  }

  _squirtStoreChange(messageId, state) {
    if (messageId === 'squirt.nextWord') {
      this.setState({error: null, node: state, ready: true})
    }
    if (messageId === 'squirt.ready') {
      this.setState({error: null, node: SquirtStore.lastNode, ready: true})
    }
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
  ComponentRegistry.unregister(MessageLoaderHeader)
}
