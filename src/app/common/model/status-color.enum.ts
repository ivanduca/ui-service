import { EnumKeyConverter } from "../helpers/EnumKeyConverter";

export enum StatusColor {
  STATUS_200='#1ea233',
  STATUS_202='#6ab357',
  STATUS_400='#e31b19',
  STATUS_407='#ea670c',
  STATUS_404='#e31b19',
  STATUS_408='#ea670c',
  STATUS_500='#484a43',
  STATUS_501='#ffe000'
} 

export class StatusColorConverter extends EnumKeyConverter<StatusColor> {
  constructor() {
      super(StatusColor);
  }
}
