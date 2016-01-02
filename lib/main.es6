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
  componentWillUnmount() {
    console.log('Squirt Component unmouned')
    SquirtStore.clearTimeouts();
    if (this._storeUnlisten) {
     this._storeUnlisten();
   }
  }

  render() {
    if (this.state.error) {
      return <div className="squirt__container error">{this.state.error.message}</div>
    }

    if (!this.state.node) {
      // TODO: display controlls
      return null;
    }
    return <div className="squirt__container">
      <div className="squirt__reader">
          <div className="squirt__nodes">
            <div className="squirt__node start">
              <div className="text">{this.state.node.start}</div>
            </div>
            <div className="squirt__node ORP">{this.state.node.ORP}</div>
            <div className="squirt__node end">{this.state.node.end}</div>
          </div>
      </div>
    </div>
  }

  _squirtStoreChange(messageId, state) {
    if (messageId = 'squirt.nextNode') {
      this.setState({error: null, node: state})
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
