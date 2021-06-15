import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import del_icon from './icons/delete_4219.png';
import Container from './components/Container';
import {tzdata} from './WatchData';

tzdata.sort((a,b) => {
  if (a.name > b.name) { return 1; }
  return -1;
})

const curDate = new Date();
const format='YYYY-MM-DD HH:mm:ss';
// const AllNames = moment.tz.names();

 export class General extends React.Component {
  constructor(props) {
    super(props);
    this.currentTZ = tzdata[0].tz;
  }
  state = { prev: '', current: '' }
  selection(evt) {
    this.currentTZ = evt.target.value;
  }
  renew(evt) {
    evt.preventDefault();
    this.setState( (prev) => ({prev, current: this.currentTZ}) );
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
            <WatchGroup watch={this.state.current} />
        </div>
      </React.Fragment>
    );    
  }
}

class WatchGroup extends React.Component {
  static propTypes = {
    watch: PropTypes.string.isRequired
  };
  constructor(props) {
    super(props);
    this.timeArray = [];
  }
  state={prev: [], current: []}

  addFunction() {
    const sel = tzdata.find(o => o.tz === this.props.watch);
    if (!sel) { return; }
    if (this.timeArray.findIndex(o => o.description === this.props.watch) !== -1) { return; }
    this.timeArray.push({
      description: this.props.watch,
      moment: new moment(curDate).tz(this.props.watch), 
      format: format,
      label: sel.name
    });
    this.setState( (prev) => ({ prev: prev, current: this.timeArray }) );
  }

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
    this.addFunction();
    return (
    <Container class="WatchGroup">
      {this.timeArray.map(
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
    this.switcher = this.switcher.bind(this);
  }
  componentDidMount() {
    // eslint-disable-next-line no-undef
    this.interval = setInterval(this.switcher.bind(this), 1000);
    const key = this.props.timeArray.findIndex( o => o.description === this.props.description);
    if (key === -1) { return; }
    this.props.timeArray[key].interval = this.interval;
  }
  switcher() {
    this.setState( (prev) => ({prev: prev, current: new moment().tz(this.props.description)}) );
  }
  killWatch() {
    // eslint-disable-next-line no-undef
    clearInterval(this.interval);
    this.props.killFunction(this.props.description);
  }
  componentWillUnmount() {
    this.killWatch();
  }
  render () {
    return (
    <Container class="ShowWatch">
      <p className="MyTimeFormat">{this.state.current.format(this.props.format)}</p>
      <p>{this.props.label}</p>
      <img className="del-sign" src={del_icon} onClick={this.killWatch.bind(this)}/>
    </Container>
    );
  }
}
// 
{/* <i className="fas fa-trash-alt del-sign" onClick={this.killWatch.bind(this)}/> */}
