import { Base } from './base.model';
import { TableRow } from './table-row.model';

export class Table {

  constructor(public keys: string[], public rows: TableRow[]) {}

  public static buildBaseTable(keys: string[], items: Base[]) {
    const rows  = [];
    items.forEach( item => {
    });
    return new Table(keys, rows);
  }
}
