export default class Manager {
  constructor() {
    this.currentFocus = -1;
    this.items = [];
    this.selectionHandler = null;
    this.trigger = null;
  }

  moveFocus(itemIndex) {
    this.items[itemIndex].node.focus();
    this.currentFocus = itemIndex;
  }

  moveFocusUp() {
    const { items, currentFocus } = this;
    const next = (currentFocus === -1 || currentFocus === 0)
      ? items.length - 1
      : currentFocus - 1;
    this.moveFocus(next);
  }

  moveFocusDown() {
    const { items, currentFocus } = this;
    const next = (currentFocus === -1 || currentFocus === items.length - 1)
      ? 0
      : currentFocus + 1;
    this.moveFocus(next);
  }

  moveToLetter(letter) {
    const { items, currentFocus } = this;

    // An array of the items starting with this one
    // and looping through the end back around
    const ouroborosItems = items.slice(currentFocus + 1)
      .concat(items.slice(0, currentFocus + 1));

    for (let i = 0, l = ouroborosItems.length; i < l; i++) {
      const item = ouroborosItems[i];
      if (!item.text && !item.content.charAt) {
        throw new Error('ariaMenuButton MenuItems must have a textual child or a `text` prop');
      }
      if (item.text) {
        if (item.text.charAt(0).toLowerCase() !== letter.toLowerCase()) {
          continue;
        }
      } else if (item.content.charAt(0).toLowerCase() !== letter.toLowerCase()) {
        continue;
      }
      this.moveFocus(items.indexOf(item));
      return;
    }
  }

  focusTrigger() {
    this.trigger.focus();
  }
}
