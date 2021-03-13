import React from 'react';
import PropTypes from 'prop-types';

/**
 * Универсальный компонент. Класс для контейнера передается в атрибуте class
 * Контент передается через children
 */
export default class Container extends React.Component {
  static propTypes = {
    typ: PropTypes.string,
    href: PropTypes.string,
    class: PropTypes.string,
    alt: PropTypes.string,
    children: PropTypes.node
  }
  constructor(props) {
    super(props);
  }
  render()  {
    if (this.props.typ === 'a') {
      return (<a className={this.props.class} href={this.props.href}>{this.props.children}</a>);
    } 
    else if (this.props.typ === 'img') {
      return (
      <React.Fragment>
        <img className={this.props.class} src={this.props.href} alt={this.props.alt}/>
        <br/>
      </React.Fragment>
      );
    }
    else if (this.props.typ === 'span') {
      return (<span className={this.props.class}>{this.props.children}</span>);
    }
    return (<div className={this.props.class}>{this.props.children}</div>);
  }
}
