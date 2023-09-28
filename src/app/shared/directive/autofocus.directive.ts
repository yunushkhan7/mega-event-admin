import { Directive, ElementRef, Input } from '@angular/core';
declare const window: any;
export class GlobalUtils {
  static isBrowser() {
    return Boolean(typeof window !== 'undefined');
  }
}
@Directive({
  selector: '[custom-autofocus]',
})
export class AutofocusDirective {
  private focus = true;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.focus) {
      if (GlobalUtils.isBrowser()) {
        //Otherwise Angular throws error: Expression has changed after it was checked.
        window.setTimeout(() => {
          this.el.nativeElement.focus();
        });
      }
    }
  }

  @Input() set autofocus(condition: boolean) {
    this.focus = condition !== false;
  }
}
