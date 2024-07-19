import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectControlOption } from 'design-angular-kit';
import { TranslateService } from '@ngx-translate/core';
import { CodiceCategoria } from '../../common/model/codice-categoria.enum';
import { Regione } from '../../common/model/regione.enum';
@Component({
  selector: 'company-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './company-search.component.html',
  styles:` 
    @media (max-width: 425px) {
      .btn-xs {
        padding-right: 6px;
        padding-left: 6px;
      }
    }
  `
})
export class CompanySearchComponent implements OnInit, OnDestroy{
  
  public filterFormSearch: FormGroup;
  public collapse: boolean = false;
  options: Array<SelectControlOption> = [];
  optionsCategoria: Array<SelectControlOption> = [{ value: '', text: '*', selected: true }];
  optionsRegione: Array<SelectControlOption> = [{ value: '', text: '*', selected: true }];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private translateService: TranslateService,
              protected router: Router) {
    this.translateService.get(`it`).subscribe((labels: any) => {
      this.options.push({ value: 'codiceIpa', text: labels.company.codiceIpa });
      this.options.push({ value: 'denominazioneEnte', text: labels.company.denominazioneEnte });
      this.options.push({ value: 'createdAt,desc', text: labels.order.createdAt.desc });
    });
    Object.keys(CodiceCategoria).forEach((key) => {
      this.optionsCategoria.push({ value: key, text: CodiceCategoria[key]});
    });
    Object.keys(Regione).forEach((key) => {
      this.optionsRegione.push({ value: Regione[key], text: Regione[key]});
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.filterFormSearch = this.formBuilder.group({
        denominazioneEnte: new FormControl(''),
        codiceFiscaleEnte: new FormControl(),
        codiceIpa: new FormControl(queryParams['codiceIpa']),
        codiceCategoria: new FormControl(queryParams['codiceCategoria']),
        indirizzo: new FormControl(''),
        regione: new FormControl(''),
        provincia: new FormControl(''),
        comune: new FormControl(''),
        sort: new FormControl(''),
      });
    });
  }

  // -------------------------------
  // On Destroy.
  // -------------------------------

  public ngOnDestroy() {
  }

}
