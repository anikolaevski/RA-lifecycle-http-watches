import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Container from './components/Container';
import {tzdata} from './WatchData';

tzdata.sort((a,b) => {
  if (a.name > b.name) { return 1; }
  return -1;
})
console.log(tzdata);

const curDate = new Date();
const format='YYYY-MM-DD HH:mm:ss';
// const AllNames = moment.tz.names();

 export class General extends React.Component {
  constructor(props) {
    super(props);
    this.timeArray = [];
    this.currentTZ =tzdata[0].tz;
  }
  state = { prev: [], current: [] }
  selection(evt) {
    this.currentTZ = evt.target.value;
    // console.log(this.currentTZ);
  }
  renew(evt) {
    evt.preventDefault();
    const sel = tzdata.find(o => o.tz === this.currentTZ);
    if (!sel) { return; }
    this.timeArray.push({
      description: this.currentTZ, 
      moment: new moment(curDate).tz(this.currentTZ), 
      format: format,
      label: sel.name
    });
    this.setState( (prev) => ({prev, current: this.timeArray}) );
  }
  render() {
    return (
      <React.Fragment>
        <form className="General GeneralForm">
          <label htmlFor="city-select">Выберите город:</label>
          <select onChange={this.selection.bind(this)}>
            {tzdata.map(o => <option key={o.name} id="city-select" value={o.tz}>{o.name}</option>)}
          </select>
          <button onClick={this.renew.bind(this)}>Добавить</button>
        </form>
        <div className="General">
            {/* <Container class="FirstClass">Страница в разработке, {datestr}</Container> */}
            <WatchGroup watches={this.timeArray} />
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
  state={prev: this.props.watches, current: this.props.watches}
  killfunction(killDesc) { //kill selected watch by click
    const ar = this.state.current;
    const key = ar.findIndex( o => o.description === killDesc);
    if (key === -1) { return; }
    // eslint-disable-next-line no-undef
    clearInterval(ar[key].interval);
    ar.splice(key, 1);
    this.setState( (prev) => ({ prev: prev, current: ar }) );
  }
  render () {
    return (
    <Container class="WatchGroup">
      {this.props.watches.map(
        o => <ShowWatch 
          key={o.description} 
          description={o.description} 
          moment={o.moment} 
          format={o.format}
          label={o.label}
          killFunction={this.killfunction.bind(this)}
          timeArray={this.state.current}/>
      )}
    </Container>
    );
  }
}

class ShowWatch extends React.Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    moment: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    killFunction: PropTypes.func.isRequired,
    timeArray: PropTypes.array.isRequired
  };
  state={prev: this.props.moment, current: this.props.moment}
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // eslint-disable-next-line no-undef
    const interval = setInterval(this.switcher.bind(this), 1000);
    const key = this.props.timeArray.findIndex( o => o.description === this.props.description);
    if (key === -1) { return; }
    this.props.timeArray[key].interval = interval;
  }
  switcher() {
    this.setState( (prev) => ({prev: prev, current: new moment().tz(this.props.description)}) );
  }
  killWatch() {
    this.props.killFunction(this.props.description);
  }
  render () {
    return (
    <Container class="ShowWatch">
      <p className="MyTimeFormat">{this.state.current.format(this.props.format)}</p>
      <p>{this.props.label}</p>
      <i className="fas fa-trash-alt del-sign" onClick={this.killWatch.bind(this)}/>
    </Container>
    );
  }
}
