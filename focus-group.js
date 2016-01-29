var activeGroup;

function FocusGroup(options) {
  this._settings = {
    forwardArrows: options.forward || ['down'],
    backArrows: options.prev || ['up'],
    letterNavigation: options.letterNavigation,
    cycle: options.cycle,
  }
  this._nodes = options.initialNodes || [];
  this._handleKeyDown = this.handleKeyDown.bind(this);
}

FocusGroup.prototype._getActiveNodeIndex = function() {
  return this._nodes.indexOf(document.activeElement);
}

FocusGroup.prototype.activate = function() {
  if (activeGroup) activeGroup.deactivate();
  activeGroup = this;
  document.documentElement.addEventListener('keydown', this._handleKeyDown, true);
  return this;
};

FocusGroup.prototype.deactivate = function() {
  activeGroup = null;
  document.documentElement.removeEventListener('keydown', this._handleKeyDown, true);
  return this;
};

FocusGroup.prototype.handleKeyDown = function(event) {
  var activeNodeIndex = this._getActiveNodeIndex();
  if (activeNodeIndex === -1) return;

  var arrow = getEventArrowKey(event);
  if (!arrow) {
    this.moveFocusByLetter(event);
    return;
  }

  if (this._settings.forwardArrows.indexOf(arrow) !== -1) {
    event.preventDefault();
    this.moveFocusForward(activeNodeIndex);
    return;
  }
  if (this._settings.backArrows.indexOf(arrow) !== -1) {
    event.preventDefault();
    this.moveFocusBack(activeNodeIndex);
  }
};

FocusGroup.prototype.moveFocusForward = function(activeNodeIndex) {
  var targetNodeIndex;
  if (activeNodeIndex < this._nodes.length - 1) {
    targetNodeIndex = activeNodeIndex + 1;
  } else if (this._settings.cycle) {
    targetNodeIndex = 0;
  } else {
    targetNodeIndex = activeNodeIndex;
  }
  this.focusNodeAtIndex(targetNodeIndex);
  return targetNodeIndex;
};

FocusGroup.prototype.moveFocusBack = function(activeNodeIndex) {
  var targetNodeIndex;
  if (activeNodeIndex > 0) {
    targetNodeIndex = activeNodeIndex - 1;
  } else if (this._settings.cycle) {
    targetNodeIndex = this._nodes.length - 1;
  } else {
    targetNodeIndex = activeNodeIndex;
  }
  this.focusNodeAtIndex(targetNodeIndex);
  return targetNodeIndex;
};

FocusGroup.prototype.moveFocusByLetter = function(event) {
  if (!isLetterKeyCode(event.keyCode)) return -1;

  // If the letter key is part of a key combo,
  // let it do whatever it was going to do
  if (event.ctrlKey || event.metaKey || event.altKey) return -1;

  event.preventDefault();

  var letter = String.fromCharCode(event.keyCode);
  var activeNodeIndex = this._getActiveNodeIndex() || 0;

  // An array of this group's nodes that starts
  // with the active one and loops through
  // the end back around
  var ouroborosNodes = this._nodes
    .slice(activeNodeIndex + 1)
    .concat(this._nodes.slice(0, activeNodeIndex + 1));

  var node, nodeText, i, l;
  for (i = 0, l = ouroborosNodes.length; i < l; i++) {
    node = ouroborosNodes[i];
    nodeText = node.getAttribute('data-focus-group-text') || node.textContent;

    if (!nodeText) {
      throw new Error('focus-group error: You cannot move focus by letter with text-less nodes');
    }

    if (nodeText.charAt(0).toLowerCase() === letter.toLowerCase()) {
      focusNode(node);
      return this._nodes.indexOf(node);
    }
  }
};

FocusGroup.prototype.focusNodeAtIndex = function(targetNodeIndex) {
  focusNode(this._nodes[targetNodeIndex]);
};

FocusGroup.prototype.addNode = function(node) {
  this._nodes.push(node);
};

FocusGroup.prototype.removeNode = function(node) {
  var nodeIndex = this._nodes.indexOf(node);
  if (nodeIndex === -1) return;
  this._nodes.splice(nodeIndex, 1);
};

FocusGroup.prototype.clearNodes = function() {
  this._nodes = [];
};

FocusGroup.prototype.setNodes = function(nextNodes) {
  this._nodes = nextNodes;
};

module.exports = function createArrowOrder(options) {
  return new FocusGroup(options);
};

function getEventArrowKey(event) {
  if (event.key === 'ArrowUp' || event.keyCode === 38) return 'up';
  if (event.key === 'ArrowDown' || event.keyCode === 40) return 'down';
  if (event.key === 'ArrowLeft' || event.keyCode === 37) return 'left';
  if (event.key === 'ArrowRight' || event.keyCode === 39) return 'right';
  return null;
}

function isLetterKeyCode(keyCode) {
  return keyCode >= 65 && keyCode <= 90;
}

function focusNode(node) {
  if (node && node.focus) node.focus();
}
