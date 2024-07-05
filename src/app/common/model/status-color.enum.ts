import { EnumKeyConverter } from "../helpers/EnumKeyConverter";

export enum StatusColor {
  STATUS_200='#008055',
  STATUS_202='#995c00',
  STATUS_400='#cc334d',
  STATUS_407='#f73e5a',
  STATUS_404='#cc334d',
  STATUS_500='#330d12'
}

export class StatusColorConverter extends EnumKeyConverter<StatusColor> {
  constructor() {
      super(StatusColor);
  }

}