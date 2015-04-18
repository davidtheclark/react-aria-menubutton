import React from 'react';
import MenuItem from './MenuItem';
import cssClassnamer from './cssClassnamer';

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
         className={cssClassnamer.componentPart('li')}
         role='presentation'>
          <MenuItem {...item}
           focusManager={props.focusManager}
           handleSelection={props.handleSelection}
           isSelected={item.value === selectedValue} />
        </li>
      );
    });

    const menuClasses = [cssClassnamer.componentPart('menu')];
    if (props.flushRight) menuClasses.push(cssClassnamer.componentPart('menu--flushRight'));

    return (
      <ol className={menuClasses.join(' ')}
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
