export default {

  init(componentName='AriaMenuButton', namespace) {
    this.namespace = namespace;
    this.componentName = this.applyNamespace(componentName);
  },

  componentPart(remainder) {
    if (!remainder) return this.componentName;
    return `${this.componentName}-${remainder}`;
  },

  applyNamespace(str) {
    if (!this.namespace) return str;
    return `${this.namespace}-${str}`;
  }

};
