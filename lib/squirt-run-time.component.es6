import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';
export default class SquirtrunTime extends React.Component {
  static displayName = 'SquirtRunTime'

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({runTime: SquirtStore.getRunTimeString()})
  }

  componentDidMount() {
    this._storeUnlisten = SquirtStore.listen(this::this._squirtStoreChange);
  }

  componentWillUnmount() {
    if (this._storeUnlisten) {
      this._storeUnlisten();
    }
  }

  render() {
    return  <div className="squirt__run-time">{this.state.runTime}</div>
   }

  _squirtStoreChange(messageId, state) {
     if (messageId === 'squirt.updateWpm') {
       this.setState({runTime: SquirtStore.getRunTimeString()})
     }
  }
}
