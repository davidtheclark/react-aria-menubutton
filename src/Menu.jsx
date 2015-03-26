import React, { PropTypes } from 'react';
import classNames from 'classnames';
import MenuItem from './MenuItem';

export default class AriaDropdownMenu extends React.Component {

  shouldComponentUpdate(newProps) {
    return this.props.selectedValue !== newProps.selectedValue;
  }

  componentWillMount() {
    this.props.focusManager.focusables = [];
  }

  componentDidMount() {
    if (this.props.receiveFocus) this.props.focusManager.move(0);
  }

  render() {
    const props = this.props;
    const selectedValue = props.selectedValue;

    const items = props.items.map((item, i) => {
      return (
        <li key={i}
         className='AriaMenuButton-li'
         role='presentation'>
          <MenuItem {...item}
           focusManager={props.focusManager}
           handleSelection={props.handleSelection}
           isSelected={item.value === selectedValue} />
        </li>
      );
    });

    const menuClasses = classNames({
      'AriaMenuButton-menu': true,
      'AriaMenuButton-menu--flushRight': props.flushRight
    });

    return (
      <ol className={menuClasses}
       role='menu'>
        {items}
      </ol>
    );
  }
}

AriaDropdownMenu.propTypes = {
  focusManager: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  flushRight: PropTypes.bool,
  handleSelection: PropTypes.func,
  receiveFocus: PropTypes.bool,
  selectedValue: PropTypes.any
};
