
import {of as observableOf, Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {CommonService} from './common.service';
import {SpringError} from '../model/spring-error.model';
import {ValidationHelper} from '../validation/validation-helper';
import { OnInit, Directive } from '@angular/core';
import {Breadcrumbs} from '../model/breadcrumbs.model';
import {Base} from '../model/base.model';

@Directive()
export abstract class CommonEditComponent<T extends Base> implements OnInit {

  public entity: T;

  public attributiForm: FormGroup;

  public form: FormGroup;

  public breadcrumbs;

  public entityError;

  public constructor(protected service: CommonService<T>, protected router: Router, protected route: ActivatedRoute) {}

  public ngOnInit() {

    this.route.params.subscribe((params) => {
      this.route.queryParams.subscribe( (queryParams) => {
        this.parseQueryParams(queryParams);
        const id = params['id'];
        if (id) {
          this.service.getById(id).subscribe(
            (entity: T) => {
              this.setEntity(entity);
            }
          );
        } else {
          this.beforeFormCreation().subscribe(() => {
          });
        }
      });
    });

    this.setBreadcrums();
  }

  public abstract setEntity(entity: T);

  public abstract buildUpdateForm(id: number, entity: T);

  public abstract buildCreateForm();

  public abstract buildInstance(): T;

  public setBreadcrums() {
    this.breadcrumbs =  new Breadcrumbs().withModule(this.service.getModule()).withRoute(this.service.getRoute())
      .withList().withEdit(true);
  }

  /**
   * Utile quando il fetch della entity da modificare richiede altre chiamate asincrone.
   * @returns {Observable<any>}
   */
  public completeEntityFetch(): Observable<any> {
    return observableOf(null);
  }

  public beforeFormCreation(): Observable<any> {
    return observableOf(null);
  }

  public isEdit() {
    return this.form && this.form.value.id;
  }

  public isCreate() {
    return !this.isEdit();
  }

  public getBack(): String {
    // debugger;
    if (this.isCreate()) {
      return '..';
    }
    const backRoute = this.editBackRoute() ? this.editBackRoute() : '../..';
    return backRoute;
  }

  /**
   * Handler del submit form save.
   * Se la form è in uno stato valid chiama il metodo save del servizio, passando una entity costruita.
   * In caso di errore aggiunge alla form gli eventuali altri errori provenienti dalla risposta spring.
   */
  public onSubmit() {

    if (this.form.valid) {

      let entity = this.buildInstance();

      this.saveCall(entity).subscribe((saveValue) => {
          entity = saveValue;
        },
        // error
        (springError: SpringError) => {
          ValidationHelper.formAddErrors(this.form, springError);
        });
    }
  }

  /**
   * Utile quando voglio chiamare un metodo particolare per effettuare save.
   * @returns {Observable<any>}
   */
  public saveCall(entity): Observable<any> {
    return this.service.save(entity);
  }

  public onDelete() {
    this.service.delete(this.form.value.id).subscribe(
      (response) => {
        this.router.navigate(['../..'], {relativeTo: this.route});
      },
    );
  }

  public onSuccess(value) {
    const editRoute = this.editBackRoute() ? this.editBackRoute() : '../../show/' + value.getId();
    const editFragment = this.editBackFragment() ? this.editBackFragment() : null;
    const extras = { relativeTo: this.route};

    if (editFragment) {
      extras['queryParams'] = {'ref': editFragment};
    }

    if (this.isEdit()) {
      return this.router.navigate([editRoute], extras);
    }

    if (this.isCreate()) {
      return this.router.navigate(['../show/' + value.getId()], extras);
    }
  }

  public editBackRoute(): string { return null; }

  public editBackFragment(): string { return null; }

  public parseQueryParams(params) {}

  public getBreadcrumbs(): Breadcrumbs {
    return this.breadcrumbs;
  }

  public isEntityFetched(): boolean {
    return this.entity ? true : false;
  }

  get isEntityError(): boolean {
    return this.entityError ? true : false;
  }

  public isLoaded(): boolean {
    return this.form && (this.isCreate() || this.isEntityFetched());
  }

}
