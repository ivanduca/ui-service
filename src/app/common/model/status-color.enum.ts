import { EnumKeyConverter } from "../helpers/EnumKeyConverter";

export enum StatusColor {
  status_200='#1ea233',
  status_202='#6ab357',
  status_400='#e31b19',
  status_407='#ea670c',
  status_404='#e31b19',
  status_408='#ea670c',
  status_500='#484a43',
  status_501='#ffe000'
} 

export class StatusColorConverter extends EnumKeyConverter<StatusColor> {
  constructor() {
      super(StatusColor);
  }
}
