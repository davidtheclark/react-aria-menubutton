import React, { PropTypes } from 'react';
import Manager from './Manager';

export default class Wrapper extends React.Component {
  componentWillMount() {
    this.manager = new Manager({
      onSelection: this.props.onSelection,
      closeOnSelection: this.props.closeOnSelection,
    });
  }

  getChildContext() {
    return {
      ambManager: this.manager,
    };
  }

  render() {
    const { tag, id, className, style } = this.props;
    return React.createElement(tag, {
      id,
      className,
      style,
    }, this.props.children);
  }
}

Wrapper.childContextTypes = {
  ambManager: PropTypes.object.isRequired,
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onSelection: PropTypes.func.isRequired,
  closeOnSelection: PropTypes.bool,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  tag: PropTypes.string,
};

Wrapper.defaultProps = {
  tag: 'div',
};
