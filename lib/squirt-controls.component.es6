import { React } from 'nylas-exports';

import SquirtStore from './squirt.store';
import SquirtWPMControl from './squirt-wpm-control.component';
import SquirtPlayPauseToggle from './squirt-play-pause-toggle.component';
import SquirtScrubber from './squirt-scrubber.component';
import SquirtRunTime from './squirt-run-time.component';

export default class SquirtControls extends React.Component {
  static displayName = 'SquirtControls'

  constructor(props) {
    super(props);
  }
  render() {
    return <div className="squirt__controls">
       <SquirtPlayPauseToggle/>
       <SquirtScrubber/>
       <SquirtRunTime/>
       <SquirtWPMControl/>
     </div>
   }
}
