import React, { PropTypes, Component } from 'react';
import { ENTER, SPACE } from './keys';
import cssClassnamer from './cssClassnamer';

export default class MenuItem extends Component {

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
    const itemClasses = [cssClassnamer.componentPart('menuItem')];
    if (props.isSelected) itemClasses.push(cssClassnamer.applyNamespace('is-selected'));

    // tabindex -1 because: "With focus on the button pressing
    // the Tab key will take the user to the next tab focusable item on the page.
    // With focus on the drop-down menu, pressing the Tab key will take the user
    // to the next tab focusable item on the page."
    // "A menuitem within a menu or menubar may appear in the tab order
    // only if it is not within a popup menu."
    // ... so not in tab order, but programatically focusable
    return (
      <div id={props.id}
       className={itemClasses.join(' ')}
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

MenuItem.propTypes = {
  focusManager: PropTypes.object.isRequired,
  handleSelection: PropTypes.func.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  id: PropTypes.string,
  isSelected: PropTypes.bool,
  text: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
};
