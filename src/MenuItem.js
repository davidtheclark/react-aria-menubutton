import React from 'react';
import { ENTER, SPACE } from './keys';

export default class MenuItem extends React.Component {

  shouldComponentUpdate(newProps) {
    return this.props.isSelected !== newProps.isSelected;
  }

  componentDidMount() {
    this.props.focusManager.focusables.push({
      content: this.props.content,
      text: this.props.text,
      node: React.findDOMNode(this)
    });
  }

  handleClick(e) {
    const props = this.props;
    if (props.isSelected) return;
    // If there's no value, we'll send the label
    const v = (typeof props.value !== 'undefined') ? props.value : props.content;
    props.handleSelection(v, e);
  }

  handleKey(e) {
    if (e.key !== ENTER && e.key !== SPACE) return;
    e.preventDefault();
    this.handleClick(e);
  }

  render() {
    const props = this.props;
    let itemClasses = 'AriaMenuButton-menuItem';
    if (props.isSelected) itemClasses += ' is-selected';

    // tabindex -1 because: "With focus on the button pressing
    // the Tab key will take the user to the next tab focusable item on the page.
    // With focus on the drop-down menu, pressing the Tab key will take the user
    // to the next tab focusable item on the page."
    // "A menuitem within a menu or menubar may appear in the tab order
    // only if it is not within a popup menu."
    // ... so not in tab order, but programatically focusable
    return (
      <div id={props.id}
       className={itemClasses}
       onClick={this.handleClick.bind(this)}
       onKeyDown={this.handleKey.bind(this)}
       role='menuitem'
       tabIndex='-1'
       data-value={props.value}>
        {props.content}
      </div>
    );
  }
}

const pt = React.PropTypes;

MenuItem.propTypes = {
  focusManager: pt.object.isRequired,
  handleSelection: pt.func.isRequired,
  content: pt.oneOfType([pt.string, pt.element]).isRequired,
  id: pt.string,
  isSelected: pt.bool,
  text: pt.string,
  value: pt.oneOfType([pt.string, pt.number, pt.bool])
};
