import React from 'react';
import MenuItem from './MenuItem';

export default class Menu extends React.Component {

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

    let menuClasses = 'AriaMenuButton-menu';
    if (props.flushRight) menuClasses += ' AriaMenuButton-menu--flushRight';

    return (
      <ol className={menuClasses}
       role='menu'>
        {items}
      </ol>
    );
  }
}

const pt = React.PropTypes;

Menu.propTypes = {
  focusManager: pt.object.isRequired,
  items: pt.arrayOf(pt.object).isRequired,
  flushRight: pt.bool,
  handleSelection: pt.func,
  receiveFocus: pt.bool,
  selectedValue: pt.any
};
