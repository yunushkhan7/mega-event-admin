import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[number]'
})
export class NumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      // (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      // (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 ||
      (e.keyCode === 110) || (e.keyCode === 190))) {
      e.preventDefault();
    }
  }


}

@Directive({
  selector: '[floatNumber]'
})
export class FloatNumberDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    const e = <KeyboardEvent>event;
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      // (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      // (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

}

@Directive({
  selector: '[keyPressAlphaNumeric]'
})
export class keyPressAlphaNumeric {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyDown(event) {

    return this.validateAlphanumeric(event);
  }

  validateAlphanumeric(event: KeyboardEvent) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

@Directive({
  selector: '[keyPressAlphaNumericWithSpace]'
})
export class keyPressAlphaNumericWithSpace {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyDown(event) {

    return this.validateAlphanumeric(event);
  }

  validateAlphanumeric(event: KeyboardEvent) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

@Directive({
  selector: '[keyPressAlphaNumericWithHypen]'
})
export class keyPressAlphaNumericWithHypen {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyDown(event) {

    return this.validateAlphanumeric(event);
  }

  validateAlphanumeric(event: KeyboardEvent) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

@Directive({
  selector: '[keyPressNumeric]'
})
export class keyPressNumeric {

  constructor(private _el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyDown(event) {

    return this.validateAlphanumeric(event);
  }

  validateAlphanumeric(event: KeyboardEvent) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
