import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  private lastPoppedUrl: string;

  constructor(private router: Router,
              private location: Location,
              protected httpClient: HttpClient,
              public translate: TranslateService) {
    translate.addLangs(['it', 'en']);
    translate.getLangs().forEach((lang: string) => {
      translate.reloadLang(lang).subscribe((res) => {
        httpClient.get('assets/i18n/custom_' + lang + '.json').subscribe((data) => {
          if (data) {
            translate.setTranslation(lang, data, true);
          }
        });
      });
    });
  }

  ngOnInit() {
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
  }
}
