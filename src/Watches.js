import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Container from './components/Container';

const curDate = new Date();
const format='YYYY-MM-DD HH:mm:ss';
const timeArray = [];
timeArray.push({description: 'Europe/Moscow', moment: new moment(curDate).tz('Europe/Moscow'), format: format});
timeArray.push({description: 'America/New_York', moment: new moment(curDate).tz('America/New_York'), format: format});

 export class General extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // setInterval(this.changeTime.bind(this), 1000);
    return (
      <React.Fragment>
        <div className="General">
          {/* <Container class="FirstClass">Страница в разработке, {datestr}</Container> */}
          <WatchGroup watches={timeArray} />
        </div>
      </React.Fragment>
    );    
  }

}

class WatchGroup extends React.Component {
  static propTypes = {
    watches: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
  }

  render () {
    return (
    <Container className="WatchGroup">
      {this.props.watches.map(
        o => <ShowWatch key={o.description} description={o.description} moment={o.moment} format={o.format}/>
      )}
    </Container>
    );
  }
}

class ShowWatch extends React.Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    moment: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired
  };
  state={prev: this.props.moment, current: this.props.moment}
  constructor(props) {
    super(props);
    setInterval(this.switcher.bind(this), 1000);
  }
  switcher() {
    this.setState( (prev) => ({prev: prev, current: new moment().tz(this.props.description)}) );
  }
  render () {
    return (
    <Container className="ShowWatch">
      <p>{this.props.description} {this.state.current.format(this.props.format)}</p>
    </Container>
    );
  }
}
