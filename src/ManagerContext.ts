import { createContext } from "react";
import type { MenuButtonManager } from "./types";

const AriaMenuButtonManagerContext = createContext<MenuButtonManager | null>(
  null
);

export default AriaMenuButtonManagerContext;
