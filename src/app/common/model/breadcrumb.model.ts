export class Breadcrumb {

  public active = false;

  constructor(public label: string, public route: string, public pathParams: number = 0) {}

}

