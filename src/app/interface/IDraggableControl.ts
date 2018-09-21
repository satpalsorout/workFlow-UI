export interface IDraggableControl {
  onSelect(): void;
  dragStart(event: any): void;
  drag(event: any): void;
  dragEnd(): void;
}
