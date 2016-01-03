import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';

export default class SquirtNode extends React.Component {
  static displayName = 'SquirtNode';
  static propTypes = {
    node: React.PropTypes.object
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._storeUnlisten = SquirtStore.listen(this::this._squirtStoreChange);
    const node = React.findDOMNode(this);
    SquirtStore.calcNodeOffsets(node);
  }

  componentWillMount() {
    this.setState({calculatedOffset: 0})
  }

  componentDidUpdate() {
    const node = React.findDOMNode(this);
    SquirtStore.calcNodeOffsets(node);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newNode = nextProps.node !== this.props.node
    const newOffset = nextState.calculatedOffset !== this.state.calculatedOffset;
    return newNode || newOffset;
  }

  componentWillUnmount() {
    if (this._storeUnlisten) {
      this._storeUnlisten();
    }
  }

  render() {
    let styles = {
      visibility: 'hidden',
    };

    if (this.state.calculatedOffset) {
       styles = {
         marginLeft: this.state.calculatedOffset,
         visibility: 'visible',
       }
    }
    // return <div> wat </div>
    return <div className="squirt__node" style={styles}>
      <span className="start">{this.props.node.start}</span>
      <span className="ORP">{this.props.node.ORP}</span>
      <span className="end">{this.props.node.end}</span>
    </div>
  }

  _squirtStoreChange(messageId, state) {
    if (messageId === 'squirt.offset') {
      this.setState({calculatedOffset: state});
    }
  }
}
