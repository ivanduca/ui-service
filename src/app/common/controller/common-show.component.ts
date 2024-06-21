import {ActivatedRoute} from '@angular/router';
import {CommonService} from './common.service';
import {Base} from '../model/base.model';
import {OnInit} from '@angular/core';
import {Breadcrumbs} from '../model/breadcrumbs.model';
import { Observable } from 'rxjs';

export abstract class CommonShowComponent<T extends Base> implements OnInit {

  public breadcrumbs;

  public entity: T;

  public constructor(protected service: CommonService<T>, protected route: ActivatedRoute) {}

  public abstract setEntity(entity: T);

  public ngOnInit() {

    this.route.params.subscribe((params) => {
      this.route.queryParams.subscribe( (queryParams) => {
        this.parseQueryParams(queryParams);
        this.fetchEntity(params['id']).subscribe(
          (entity) => {
            this.setEntity(entity);
            this.onEntityFetch();
          }
        );
      });
    });

    this.breadcrumbs =  new Breadcrumbs().withModule(this.service.getModule()).withRoute(this.service.getRoute())
      .withList().withShow(true);
  }

  public fetchEntity(id): Observable<T> {
    return this.service.getById(id);
  }

  public onEntityFetch() {}

  public getBreadcrumbs(): Breadcrumbs {
    return this.breadcrumbs;
  }

  public isEntityFetched(): boolean {
    return this.entity ? true : false;
  }

  public isLoaded(): boolean {
    return this.isEntityFetched();
  }

  public parseQueryParams(params) {}

  public getBack(): String {
    const backRoute = this.showBackRoute() ? this.showBackRoute() : '../..';
    return backRoute;
  }

  public showBackRoute(): string { return null; }

  public showBackFragment(): string { return null; }

}
