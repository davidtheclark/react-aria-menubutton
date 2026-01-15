import type {
  MenuButtonManager,
  OpenMenuOptions,
  CloseMenuOptions,
} from "./types";

const registeredManagers = new Map<string, MenuButtonManager>();

const errorCommon =
  "a menu outside a mounted Wrapper with an id, or a menu that does not exist";

function registerManager(menuId: string, manager: MenuButtonManager): void {
  registeredManagers.set(menuId, manager);
}

function unregisterManager(menuId: string): void {
  registeredManagers.delete(menuId);
}

function openMenu(menuId: string, openOptions?: OpenMenuOptions): void {
  const manager = registeredManagers.get(menuId);
  if (!manager) throw new Error("Cannot open " + errorCommon);
  manager.openMenu(openOptions);
}

function closeMenu(menuId: string, closeOptions?: CloseMenuOptions): void {
  const manager = registeredManagers.get(menuId);
  if (!manager) throw new Error("Cannot close " + errorCommon);
  manager.closeMenu(closeOptions);
}

export { registerManager, unregisterManager, openMenu, closeMenu };
