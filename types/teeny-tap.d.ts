declare module "teeny-tap" {
  export interface TapListener {
    remove(): void;
  }

  export type TapHandler = (event: MouseEvent | TouchEvent) => void;

  export default function createTapListener(
    element: HTMLElement,
    handler: TapHandler
  ): TapListener;
}
