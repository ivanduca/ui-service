import { Base } from './base.model';

export class Page<T extends Base> {

  constructor(public content: T[],
              public empty: boolean,
              public first: boolean,
              public last: boolean,
              public number: number,
              public numberOfElements: number,
              public size: number,
              public sort: [],
              public totalElements: number,
              public totalPages: number
            ) {}
}
