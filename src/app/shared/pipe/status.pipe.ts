import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value ? parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '00';
    // return parseFloat(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
