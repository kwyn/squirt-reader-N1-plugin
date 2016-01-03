import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';
import SquirtWPMControl from './squirt-wpm-control.component';
import SquirtPlayPauseToggle from './squirt-play-pause-toggle.component';
import SquirtScrubber from './squirt-scrubber.component';

export default class SquirtControls extends React.Component {
  static displayName = 'SquirtControls'

  constructor(props) {
    super(props);
    this.maxWpm = SquirtStore.getMaxWpm();
    this.minWpm = SquirtStore.getMinWpm();
  }

  componentWillMount() {
    this.setState({wpm: this.minWpm })
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
    return <div className="squirt__controls">
       <SquirtPlayPauseToggle/>
       <SquirtScrubber/>
       <SquirtWPMControl/>
     </div>
   }

  _squirtStoreChange(messageId, state) {

  }
}
