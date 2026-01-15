declare module "focus-group" {
  export interface FocusGroupMember {
    node: HTMLElement;
    text?: string;
  }

  export interface FocusGroupOptions {
    wrap?: boolean;
    stringSearch?: boolean;
    stringSearchDelay?: number;
  }

  export interface FocusGroup {
    activate(): void;
    deactivate(): void;
    addMember(member: FocusGroupMember): void;
    removeMember(member: FocusGroupMember): void;
    clearMembers(): void;
    focusNodeAtIndex(index: number): void;
    moveFocusToFirst(): void;
    moveFocusToLast(): void;
    _handleUnboundKey(event: KeyboardEvent): void;
  }

  export default function createFocusGroup(
    options?: FocusGroupOptions
  ): FocusGroup;
}
