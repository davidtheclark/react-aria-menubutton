var registeredManagers = {};

var errorCommon = 'a menu outside a mounted Wrapper with an id, or a menu that does not exist';

function registerManager(menuId, manager) {
  registeredManagers[menuId] = manager;
}

function unregisterManager(menuId) {
  delete registeredManagers[menuId];
}

function openMenu(menuId) {
  var manager = registeredManagers[menuId];
  if (!manager) throw new Error('Cannot open ' + errorCommon);
  manager.openMenu();
}

function closeMenu(menuId, closeOptions) {
  var manager = registeredManagers[menuId];
  if (!manager) throw new Error('Cannot close ' + errorCommon);
  manager.closeMenu(closeOptions);
}

function focusItem(menuId, index) {
  var manager = registeredManagers[menuId];
  if (!manager) throw new Error('Cannot close ' + errorCommon);
  manager.focusGroup.activate();
  if (manager.isOpen) {
    var self = manager;
    this.moveFocusTimer = setTimeout(function() {
      self.focusItem(0)
    }, 0);
  }
}

module.exports = {
  registerManager: registerManager,
  unregisterManager: unregisterManager,
  openMenu: openMenu,
  closeMenu: closeMenu,
  focusItem: focusItem,
}
