import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ManagerContext from './ManagerContext';
import { refType } from './propTypes';
import specialAssign from './specialAssign';
import createManager from './createManager';

const checkedProps = {
  children: PropTypes.node.isRequired,
  forwardedRef: refType,
  onMenuToggle: PropTypes.func,
  onSelection: PropTypes.func,
  closeOnSelection: PropTypes.bool,
  closeOnBlur: PropTypes.bool,
  tag: PropTypes.string,
};

class AriaMenuButtonWrapper extends Component {
  constructor(props) {
    super(props);
    this.manager = createManager({
      onMenuToggle: this.props.onMenuToggle,
      onSelection: this.props.onSelection,
      closeOnSelection: this.props.closeOnSelection,
      closeOnBlur: this.props.closeOnBlur,
      id: this.props.id,
    });
  }

  render() {
    const wrapperProps = {};
    specialAssign(wrapperProps, this.props, checkedProps);

    return React.createElement(
      ManagerContext.Provider,
      { value: this.manager },
      React.createElement(
        this.props.tag,
        wrapperProps,
        this.props.children,
      ),
    );
  }
}

module.exports = React.forwardRef((props, ref) => {
  const wrapperProps = { forwardedRef: ref };
  specialAssign(wrapperProps, props,
    { children: checkedProps.children, forwardedRef: checkedProps.forwardedRef });
  specialAssign(wrapperProps, { forwardedRef: ref });
  return React.createElement(AriaMenuButtonWrapper, wrapperProps, props.children);
});

AriaMenuButtonWrapper.propTypes = checkedProps;

AriaMenuButtonWrapper.defaultProps = {
  tag: 'div',
  onMenuToggle: undefined,
  onSelection: undefined,
  closeOnSelection: true,
  closeOnBlur: true,
};
