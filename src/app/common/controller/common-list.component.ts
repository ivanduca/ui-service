
import { of as observableOf, Observable, of, Subscription } from 'rxjs';

import {debounceTime, switchMap, map} from 'rxjs/operators';
import {CommonService} from './common.service';
import {Page} from '../model/page.model';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { ChangeDetectorRef, OnDestroy, OnInit, Input, ViewRef, Directive } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Breadcrumbs} from '../model/breadcrumbs.model';

import {NavigationService} from '../../core/navigation.service';
import { Base } from '../model/base.model';

@Directive()
export abstract class CommonListComponent<T extends Base> implements OnInit, OnDestroy {

  public count = 0;

  @Input("filterForm")
  public filterForm: FormGroup;

  public breadcrumbs;

  public subscription;

  public initialized;

  public canCreate = false;

  public loading = true;

  public searching = false;

  private hasMoreItems = true;

  // -------------------------------
  // Costruttore
  // -------------------------------

  public constructor(protected service: CommonService<T>,
                     protected route: ActivatedRoute,
                     protected router: Router,
                     protected changeDetector: ChangeDetectorRef,
                     protected navigationService: NavigationService) {
  }


  // -------------------------------
  // Metodi Abstract.
  // -------------------------------

  public abstract setItems(list: T[]);

  public abstract getItems(): T[];

  public abstract buildFilterForm(): FormGroup;

  // -------------------------------
  // On Init.
  // -------------------------------


  onChanges(): void {
  
  }
  public ngOnInit() {

    this.beforeOnInit().subscribe(() => {

      // Inizializzo il numero della pagina selezionata (0 se è la prima esecuzione)
      this.initializePage();

      // Costruisco la filterForm
      this.filterForm = this.buildFilterForm();

      // Sottoscrivo la modifica dei valori in filterForm
      if (this.filterForm) {
        this.filterForm.valueChanges.pipe(
          debounceTime(500),
          switchMap(id =>  {
            this.initializePage();
            return this.executePageable();
          })
        ).subscribe(
          (pageResult: Page<T>) => {
            this.pageableResult(pageResult);
          }
        );  
        // Se ho uno stato precedente modifico la form (parte la sottoscrizione precedente) oppure eseguo la
        // filterFormOnChange per il primo caricamento.
        //if (this.navigationService.getStatus(this.service.getRoute())) {
        //this.filterForm.setValue(this.navigationService.getStatus(this.service.getRoute()));
        //}
        this.filterFormOnChange();
        // Metto a disposizione un observable per caricare le filterForm options. Una volta ottenute
        // Chiamo il change detector.
        this.subscription = this.filterFormFetchOptions().subscribe(
          () => {
            this.changeDetector.detectChanges();
          }
        );
      } else {
        this.initializePage();
        this.executePageable().subscribe(
          (pageResult: Page<T>) => {
            this.pageableResult(pageResult);
          }
        );
      }
    });
  }

  private executePageable(): Observable<Page<T>> {
    this.initialized = true;
    this.loading = true;
    this.hasMoreItems = true;
    setTimeout(() => {
      if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
        this.changeDetector.detectChanges();
      }
    });
    return this.service.getPageable(
      this.navigationService.getPage(this.service.getRoute()), 
      this.filterFormValue()
    );
  }

  private pageableResult(pageResult: Page<T>) {
    this.loading = false;
    this.hasMoreItems = !pageResult.last;
    this.setItems(pageResult.content);
    this.count = pageResult.totalElements;
    if (!this.initialized) {
      this.initialized = true;
    }
    setTimeout(() => {
      if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
        this.changeDetector.detectChanges();
      }
    });  
  }
  /**
   * Operazioni asincrone prima di caricare il component (ex. se devo effettuare delle get al server).
   */
  public beforeOnInit(): Observable<any> {
    return of(null);
  }

  public customBreadcrumbs() {
    return null;
  }

  public loadList() {
    this.filterForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
  }

  // -------------------------------
  // Gestione della pagina
  // -------------------------------

  protected abstract isScrollTopOnPageChange(): boolean;

  private initializePage() {
    this.navigationService.setPage(this.service.getRoute(), 0);
  }

  public getPage() {
    return this.navigationService.getPage(this.service.getRoute());
  }

  public onChangePage(page: number) {
    this.navigationService.setPage(this.service.getRoute(), page);
    this.executePageable().subscribe((pageResult: Page<T>) => {
      this.pageableResult(pageResult);
    });
    if (this.isScrollTopOnPageChange()) {
      window.scrollTo(0, 0);
    }
  }

  // -------------------------------
  // Gestione della filterForm
  // -------------------------------

  /**
   * Quando voglio eseguire delle fetch per popolare le select.
   * @returns {Observable<any>}
   */
  public filterFormFetchOptions(): Observable<any> {
    return observableOf(null);
  }

  /**
   * Hook da utilizzare quando vi sono delle dipendenze fra campi della form.
   * ex. se cambia un campo devo modificarne un altro.
   */
  public filterFormOnChangeHook() {}

  /**
   * Quando alcuni valori della form hanno bisogno di modifiche prima di essere utilizzati dalla richiesta.
   * @returns {any}
   */
  public filterFormValue() {
    if (this.filterForm) {
      return this.filterForm.value;
    }
    return undefined;
  }

  /**
   * Metodo richiamato per ricaricare gli items, da richiamare ogni volta che cambia qualcosa (filtro o pagina)
   */
  private filterFormOnChange() {
    this.filterFormOnChangeHook();
    this.navigationService.setStatus(this.service.getRoute(), this.filterForm.value);
    this.loadList();
  }

  // -------------------------------
  // Can Create
  // -------------------------------

  public setCanCreate() {
    this.service.pCheckCreate().subscribe((result => {
      this.canCreate = result;
    }));
  }

  // -------------------------------
  // Gestione delle Breadcrumbs
  // -------------------------------

  /**
   * Breadcrumbs.
   * @returns {Breadcrumbs}
   */
  public getBreadcrumbs(): Breadcrumbs {
    return this.breadcrumbs;
  }

  // -------------------------------
  // Styles
  // -------------------------------

  public listItemClasses() {
    return {
      'list-group-item': true,
      'list-group-item-action': false,
      'pt-0': true,
      'pb-0': true
    };
  }

  loadMoreItems() {
    if (this.hasMoreItems) {
      this.initialized = true;
      this.loading = true;
      this.hasMoreItems = true;
      this.navigationService.setPage(
        this.service.getRoute(), 
        this.navigationService.getPage(this.service.getRoute()) + 1
      );
      this.service.getPageable(
        this.navigationService.getPage(this.service.getRoute()), 
        this.filterFormValue())
        .subscribe((pageResult: Page<T>) => {
          this.loading = false;
          this.hasMoreItems = !pageResult.last;
          this.setItems(this.getItems().concat(pageResult.content));
          this.count = pageResult.totalElements;
          if (!this.initialized) {
            this.initialized = true;
          }
          this.changeDetector.detectChanges();
        });  
    }
  }

  onTermChanged(event: any, field: string) {
    if (event) {
      this.filterForm.value[field] = event.object.text;
    } else {
      this.filterForm.value[field] = '';
    }
    this.navigationService.setPage(this.service.getRoute(), 0);
    this.service.getPageable(
      this.navigationService.getPage(this.service.getRoute()), 
      this.filterFormValue())
      .subscribe((pageResult: Page<T>) => {
        this.loading = false;
        this.hasMoreItems = !pageResult.last;
        this.setItems(pageResult.content);
        this.count = pageResult.totalElements;
        if (!this.initialized) {
          this.initialized = true;
        }
        this.changeDetector.detectChanges();
      });
  }

  onSearchShow(field: string) {
    this.searching = !this.searching;
    if (!this.searching) {
      this.onTermChanged(undefined, field);
    }
  }

  routerLink(link: string) {
    this.service.navigate([link], this.route);
  }
  
  public onItemTap(item: T) {
    this.service.navigate(['show/' + item.getId()], this.route);
  }

  // -------------------------------
  // On Destroy.
  // -------------------------------

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
