import { vi } from "vitest";

export interface MockKeyEvent {
  key: string;
  keyCode: number;
  preventDefault: ReturnType<typeof vi.fn>;
}

export default function createMockKeyEvent(
  key: string,
  keyCode = 0
): MockKeyEvent {
  return {
    key,
    keyCode,
    preventDefault: vi.fn(),
  };
}
