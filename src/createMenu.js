import createMenuItem from './createMenuItem';

export default function ariaMenuButtonMenu(React, classNames) {

  const MenuItem = createMenuItem(React, classNames);

  class Menu extends React.Component {

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

  const pt = React.PropTypes;
  Menu.propTypes = {
    focusManager: pt.object.isRequired,
    items: pt.arrayOf(pt.object).isRequired,
    flushRight: pt.bool,
    handleSelection: pt.func,
    receiveFocus: pt.bool,
    selectedValue: pt.any
  };

  return Menu;
}
