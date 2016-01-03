import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';
export default class SquirtWPMControl extends React.Component {
  static displayName = 'SquirtWPMControl'

  constructor(props) {
    super(props);
    this.maxWpm = SquirtStore.getMaxWpm();
    this.minWpm = SquirtStore.getMinWpm();
  }

  componentWillMount() {
    this.setState({wpm: SquirtStore.getWpm()})
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
    return  <div className="wpm__container">
         <button
           className="wpm__decrement fa fa-chevron-left"
           onClick={::SquirtStore.decrementWpm}/>
         <div className="wpm__value">{this.state.wpm} wpm</div>
         <button
           className="wpm__increment fa fa-chevron-right"
           onClick={::SquirtStore.incrementWpm}/>
       </div>
   }

  _squirtStoreChange(messageId, state) {
     if (messageId === 'squirt.updateWpm') {
       this.setState({wpm: state})
     }
  }
}
