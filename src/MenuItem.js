import React, { PropTypes } from 'react';
import keys from './keys';

export default class MenuItem extends React.Component {
  componentDidMount() {
    const props = this.props;
    this.managedIndex = props.manager.menuItems.push({
      node: React.findDOMNode(this),
      content: props.children,
      text: props.text,
    }) - 1;
  }

  handleKeyDown(event) {
    if (event.key !== keys.ENTER && event.key !== keys.SPACE) return;
    event.preventDefault();
    this.selectItem(event);
  }

  selectItem(event) {
    const props = this.props;
    // If there's no value, we'll send the child
    const value = (typeof props.value !== 'undefined')
      ? props.value
      : props.children;
    props.manager.handleSelection(value, event);
    props.manager.currentFocus = this.managedIndex;
  }

  render() {
    const { tag, children, className, id } = this.props;

    return React.createElement(tag, {
      className,
      id,
      onClick: this.selectItem.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      role: 'menuitem',
      tabIndex: '-1',
    }, children);
  }
}

MenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
  manager: PropTypes.object.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  tag: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
};

MenuItem.defaultProps = {
  tag: 'div',
};
