import {Injectable} from '@angular/core';

@Injectable()
export class NavigationService {

  public filterFormMap: Map<string, any> = new Map();

  public pageMap: Map<string, number> = new Map();

  constructor() {}

  public setStatus(route: string, status: any) {
    this.filterFormMap.set(route, status);
  }

  public getStatus(route: string): any {
    return this.filterFormMap.get(route);
  }

  public resetStatus(route: string) {
    this.filterFormMap.delete(route);
  }

  public setPage(route: string, page: number) {
    this.pageMap.set(route, page);
  }

  public getPage(route: string): number {
    return this.pageMap.get(route);
  }


}
