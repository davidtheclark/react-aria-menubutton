const registeredManagers = {};

const errorCommon =
  'a menu outside a mounted Wrapper with an id, or a menu that does not exist';

function registerManager(menuId, manager) {
  registeredManagers[menuId] = manager;
}

function unregisterManager(menuId) {
  delete registeredManagers[menuId];
}

function openMenu(menuId, openOptions) {
  const manager = registeredManagers[menuId];
  if (!manager) throw new Error('Cannot open ' + errorCommon);
  manager.openMenu(openOptions);
}

function closeMenu(menuId, closeOptions) {
  const manager = registeredManagers[menuId];
  if (!manager) throw new Error('Cannot close ' + errorCommon);
  manager.closeMenu(closeOptions);
}

module.exports = {
  registerManager: registerManager,
  unregisterManager: unregisterManager,
  openMenu: openMenu,
  closeMenu: closeMenu
};
