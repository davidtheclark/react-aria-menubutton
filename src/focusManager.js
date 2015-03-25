const focusManagerProto = {

  focusables: [],

  trigger: null,

  currentFocus: -1,

  move(i) {
    this.focusables[i].node.focus();
    this.currentFocus = i;
  },

  moveUp() {
    const next = (this.currentFocus === -1 || this.currentFocus === 0)
      ? this.focusables.length - 1
      : this.currentFocus - 1;
    this.move(next);
  },

  moveDown() {
    const next = (this.currentFocus === -1 || this.currentFocus === this.focusables.length - 1)
      ? 0
      : this.currentFocus + 1;
    this.move(next);
  },

  moveToLetter(letter) {
    const cyclo = this.focusables
      .slice(this.currentFocus + 1)
      .concat(this.focusables.slice(0, this.currentFocus + 1));
    for (let i = 0, l = cyclo.length; i < l; i++) {
      const item = cyclo[i];
      if (!item.text && !item.content.charAt) {
        throw new Error('AriaMenuButton items must have textual `content` or a `text` prop');
      }
      if (item.text) {
        if (item.text.charAt(0) !== letter) continue;
      } else if (item.content.charAt(0) !== letter) continue;
      item.node.focus();
      this.currentFocus = this.focusables.indexOf(item);
      return;
    }
  },

  focusTrigger() {
    this.trigger.focus();
  }

};

export default function focusManager() {
  return Object.create(focusManagerProto);
}
