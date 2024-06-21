import {Breadcrumb} from './breadcrumb.model';

export class Breadcrumbs {

  public items: Breadcrumb[];

  public module: string;   // ex: 'anagrafica'

  public route: string;    // ex: PersonaService.ROUTE = 'persona'

  constructor() {
    const home = new Breadcrumb('home', '');
    this.items = [home];
  }

  private moduleFullPath() {
    return '/' + this.module;
  }

  private routeFullPath() {
    return '/' + this.module + '/' + this.route;
  }

  public withModule(module: string, add: boolean = false, active: boolean = false): Breadcrumbs {
    this.module = module;
    return this;
  }

  public withRoute(route: string): Breadcrumbs {
    this.route = route;
    return this;
  }

  public withList(active: boolean = false): Breadcrumbs {
    const breadcrumbs = new Breadcrumb(this.route + '.list', this.routeFullPath());
    breadcrumbs.active = active;
    this.items.push(breadcrumbs);
    return this;
  }

  public withShow(active: boolean = false): Breadcrumbs {
    const breadcrumbs = new Breadcrumb(this.route + '.show', this.routeFullPath() + '/show');
    breadcrumbs.active = active;
    this.items.push(breadcrumbs);
    return this;
  }

  public withEdit(active: boolean = false): Breadcrumbs {
    const breadcrumbs = new Breadcrumb(this.route + '.edit', this.routeFullPath() + '/edit');
    breadcrumbs.active = active;
    this.items.push(breadcrumbs);
    return this;
  }

  public addFromRoute(path: string, label: string, active: boolean = false) {
    const breadcrumbs = new Breadcrumb(label, this.routeFullPath() + '/' + path);
    breadcrumbs.active = active;
    this.items.push(breadcrumbs);
    return this;
  }



}

