var activeGroup;

var protoOrder = {};

protoOrder.init = function(options) {
  this._settings = {
    forwardArrows: options.forward || ['down'],
    backArrows: options.prev || ['up'],
    cycle: options.cycle,
  }
  this._nodes = options.initialNodes || [];
  this._handleKeyDown = this.handleKeyDown.bind(this);
};

protoOrder.activate = function() {
  if (activeGroup) activeGroup.deactivate();
  activeGroup = this;
  document.documentElement.addEventListener('keydown', this._handleKeyDown, true);
  return this;
};

protoOrder.deactivate = function() {
  activeGroup = null;
  document.documentElement.removeEventListener('keydown', this._handleKeyDown, true);
  return this;
};

protoOrder.handleKeyDown = function(event) {
  var arrow = getEventArrowKey(event);
  if (!arrow) return;

  var activeNodeIndex = this._nodes.indexOf(document.activeElement);
  if (activeNodeIndex === -1) return;

  event.preventDefault();
  if (this._settings.forwardArrows.indexOf(arrow) !== -1) {
    return this.moveFocusForward(activeNodeIndex);
  }
  if (this._settings.backArrows.indexOf(arrow) !== -1) {
    return this.moveFocusBack(activeNodeIndex);
  }
};

protoOrder.moveFocusForward = function(activeNodeIndex) {
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

protoOrder.moveFocusBack = function(activeNodeIndex) {
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

protoOrder.focusNodeAtIndex = function(targetNodeIndex) {
  var targetNode = this._nodes[targetNodeIndex];
  if (targetNode && targetNode.focus) targetNode.focus();
};

protoOrder.addNode = function(node) {
  this._nodes.push(node);
};

protoOrder.removeNode = function(node) {
  var nodeIndex = this._nodes.indexOf(node);
  if (nodeIndex === -1) return;
  this._nodes.splice(nodeIndex, 1);
};

protoOrder.clearNodes = function() {
  this._nodes = [];
};

module.exports = function createArrowOrder(options) {
  var newOrder = Object.create(protoOrder);
  newOrder.init(options);
  return newOrder;
};

function getEventArrowKey(event) {
  if (event.key === 'ArrowUp' || event.keyCode === 38) return 'up';
  if (event.key === 'ArrowDown' || event.keyCode === 40) return 'down';
  if (event.key === 'ArrowLeft' || event.keyCode === 37) return 'left';
  if (event.key === 'ArrowRight' || event.keyCode === 39) return 'right';
  return null;
}
