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
      // "The menu contains elements with roles: menuitem,
      // menuitemcheckbox, or menuitemradio depending on your implementation."
      role: 'menuitem',
      // "With focus on the button pressing the Tab key will
      // take the user to the next tab focusable item
      // on the page."
      //
      // "With focus on the drop-down menu, pressing the Tab
      // key will take the user to the next tab focusable
      // item on the page."
      //
      // "Menu focus is managed by the menu using tabindex
      // or aria-activedescendant."
      tabIndex: '-1',
    }, children);
  }
}

MenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
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
