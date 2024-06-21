import {TableRowValue} from './table-row-value.model';

export class TableRow {

  constructor(public item, public values: Map<string, TableRowValue> = new Map()) {}

  public getRowValue(key: string): TableRowValue {
    return this.values.get(key);
  }
}
