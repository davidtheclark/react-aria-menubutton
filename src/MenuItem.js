import React, { PropTypes } from 'react';
import keys from './keys';

export default class MenuItem extends React.Component {
  componentDidMount() {
    const props = this.props;
    this.itemForManager = {
      node: React.findDOMNode(this),
      content: props.children,
      text: props.text,
    };
    props.manager.items.push(this.itemForManager);
  }

  handleKeyDown(event) {
    if (event.key !== keys.ENTER && event.key !== keys.SPACE) return;
    event.preventDefault();
    this.selectItem(event);
  }

  selectItem(event) {
    const props = this.props;
    // If there's no value, we'll send the label (child)
    const value = (typeof props.value !== 'undefined')
      ? props.value
      : props.children;
    props.manager.selectionHandler(value, event);
    props.manager.currentFocus = props.manager.items.indexOf(this.itemForManager);
  }

  render() {
    return React.createElement(this.props.tag, {
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
    }, this.props.children);
  }
}

MenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,
  manager: PropTypes.object.isRequired,
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
