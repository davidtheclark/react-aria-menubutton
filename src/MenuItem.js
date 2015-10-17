import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import keys from './keys';

export default class MenuItem extends React.Component {
  componentDidMount() {
    this.managedIndex = this.context.ambManager.menuItems.push({
      node: ReactDOM.findDOMNode(this),
      content: this.props.children,
      text: this.props.text,
    }) - 1;
  }

  handleKeyDown(event) {
    if (event.key !== keys.ENTER && event.key !== keys.SPACE) return;
    event.preventDefault();
    this.selectItem(event);
  }

  selectItem(event) {
    // If there's no value, we'll send the child
    const value = (typeof this.props.value !== 'undefined')
      ? this.props.value
      : this.props.children;
    this.context.ambManager.handleSelection(value, event);
    this.context.ambManager.currentFocus = this.managedIndex;
  }

  render() {
    const { tag, children, className, id, style } = this.props;

    return React.createElement(tag, {
      className,
      id,
      style,
      onClick: this.selectItem.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      role: 'menuitem',
      tabIndex: '-1',
    }, children);
  }
}

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  style: PropTypes.object,
  tag: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.any,
};

MenuItem.defaultProps = {
  tag: 'div',
};

MenuItem.contextTypes = {
  ambManager: PropTypes.object.isRequired,
};
