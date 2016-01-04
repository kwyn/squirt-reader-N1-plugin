import _ from 'lodash';
import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';

export default class SquirtWPMControl extends React.Component {
  static displayName = 'SquirtWPMControl'

  constructor(props) {
    super(props);
    this.maxValue = SquirtStore.getNumberOfNodes()
    this.minValue = 0;
  }

  componentWillMount() {
    this.setState({ nodeIndex: 0 })
  }

  componentDidMount() {
    this._storeUnlisten = SquirtStore.listen(this::this._squirtStoreChange);
  }

  componentWillUnmount() {
    if (this._storeUnlisten) {
      this._storeUnlisten();
    }
  }

  //  <button className="squirt__button--play"></button>
  render() {
    return  <div className="squirt__scrubber">
      <input
        type="range"
        value={this.state.nodeIndex}
        min={this.minValue}
        max={this.maxValue}
        onChange={this::this._updatePosition}/>
    </div>
  }

  _updatePosition(event) {
    const stringValue = _.get(event, 'target.value');
    const value = Number(stringValue);
    SquirtStore.jump(value)
  }

  _squirtStoreChange(messageId, state) {
     if (messageId === 'squirt.nextWord' || messageId === 'squirt.jumped') {
        const index =  SquirtStore.getCurrentIndex();
        this.setState({nodeIndex: index});
     }
     if (messageId === 'squirt.ready') {
       this.maxValue = SquirtStore.getNumberOfNodes();
       this.setState({nodeIndex: 0})
     }
  }
}
