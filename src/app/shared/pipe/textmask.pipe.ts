import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textmaskpipe'
})
export class TextmaskPipe implements PipeTransform {

  transform(text: string): string { 
    //show first and last digits based on given input   
    let firstVisibleNumbers = text.slice(0, 3);
    let maskedNumbers = text.slice(3, 6);
    let lastVisibleNumbers = text.slice(5);
    return firstVisibleNumbers + maskedNumbers.replace(/./g, '*') + lastVisibleNumbers;
  }
}
