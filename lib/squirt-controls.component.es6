import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';
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
       <div className="wpm__container">
         <button
           className="wpm__decrement fa fa-chevron-left"
           onClick={::SquirtStore.decrementWpm}/>
         <div className="wpm__value">{this.state.wpm}</div>
         <button
           className="wpm__increment fa fa-chevron-right"
           onClick={::SquirtStore.incrementWpm}/>
       </div>
     </div>
   }

  _squirtStoreChange(messageId, state) {
     if (messageId === 'squirt.updateWpm') {
       this.setState({wpm: state})
     }
  }
}
