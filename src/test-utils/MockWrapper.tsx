import type { ReactNode } from "react";
import ManagerContext from "../ManagerContext";
import type { MenuButtonManager } from "../types";

interface MockWrapperProps {
  mockManager: MenuButtonManager | Partial<MenuButtonManager>;
  children?: ReactNode;
}

function MockWrapper({ mockManager, children }: MockWrapperProps) {
  return (
    <ManagerContext.Provider value={mockManager as MenuButtonManager}>
      <div>{children}</div>
    </ManagerContext.Provider>
  );
}

export default MockWrapper;
