import { Component } from '@angular/core';
import packageJson from '../../../../package.json';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styles: `
    .logo {
      width: auto;
      height: auto;
      max-height: 150px;
      max-width: 100%;
    }
    .it-footer-main .it-brand-wrapper a .icon {
      width: auto;
      height: auto;    
    }  
  `,
    standalone: false
})
export class FooterComponent {
   version = packageJson.version;
}
