import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightedText'
})
export class HighlightedTextPipe implements PipeTransform {

  transform(value: string, args: any): string {
    if(!args) return value;
    const re = new RegExp("\\b("+args+"\\b)", 'igm');
    value = value.replace(re, '<span class="badge bg-warning rounded-pill text-white">$1</span>');
    return value;
  }

}
