'use strict';

exports.__esModule = true;
exports['default'] = {

  init: function init(_x, namespace) {
    var componentName = arguments[0] === undefined ? 'AriaMenuButton' : arguments[0];

    this.namespace = namespace;
    this.componentName = this.applyNamespace(componentName);
  },

  componentPart: function componentPart(remainder) {
    if (!remainder) {
      return this.componentName;
    }return '' + this.componentName + '-' + remainder;
  },

  applyNamespace: function applyNamespace(str) {
    if (!this.namespace) {
      return str;
    }return '' + this.namespace + '-' + str;
  }

};
module.exports = exports['default'];