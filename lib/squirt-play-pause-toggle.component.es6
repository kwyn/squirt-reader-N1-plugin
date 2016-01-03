import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';
export default class SquirtPlayPauseToggle extends React.Component {
  static displayName = 'SquirtPlayPauseToggle'

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({paused: true })
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
     const buttonIcon = this.state.paused ? 'fa fa-play' : 'fa fa-pause';
     return <button
        className={buttonIcon + ' pause-play__toggle'}
        onClick={this::this._togglePlayPause}/>
  }

  _togglePlayPause() {
    if (this.state.paused) {
      SquirtStore.play();
      return;
    }
     SquirtStore.pause();
  }

  _squirtStoreChange(messageId, state) {
     if (messageId === 'squirt.pause') {
       this.setState({paused: true})
       return;
     }
     if (messageId === 'squirt.play') {
       this.setState({paused: false});
     }
  }
}
