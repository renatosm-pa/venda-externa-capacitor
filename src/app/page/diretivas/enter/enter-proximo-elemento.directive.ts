import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {Dropdown} from 'primeng/dropdown';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[enterProximoElemento]'
})
export class EnterProximoElementoDirective {

  // isFocusInsideComponent = false;
  // isComponentClicked = false;

  @Input()
  elmentoProximoId: string;

  // @Input()
  // focusElementParent: string = null;

  constructor(private el: ElementRef) { }

  @HostListener('keyup.enter', ['$event'])
  teclaEnterPressionada(keyboardEvent: KeyboardEvent) {

    const e = document.getElementById(this.elmentoProximoId);

    // console.log(this.elmentoProximoId, e);

    if (e instanceof HTMLInputElement) { // <input>
      e.click();
      e.focus();
      e.select();
    } else if (e instanceof HTMLSelectElement) { // <select>
      e.click();
      e.focus();
    }
    else if (e instanceof HTMLTextAreaElement) { // <textarea>
      e.click();
      e.focus();
    } else if (e instanceof HTMLButtonElement) { // <button>
      e.focus();
    }

    // Implementação para um evento em ambito global do documento
    // if (!this.isFocusInsideComponent && this.isComponentClicked) {
    //   const e = document.getElementById(this.elmentoProximoId);
    //   if (e instanceof HTMLInputElement) { // <input>
    //     e.click();
    //     e.focus();
    //     e.select();
    //   } else if (e instanceof HTMLSelectElement) { // <select>
    //     e.click();
    //     e.focus();
    //   }
    //   else if (e instanceof HTMLTextAreaElement) { // <textarea>
    //     e.click();
    //     e.focus();
    //   }
    //
    //   this.isComponentClicked = false;
    // }
    // this.isFocusInsideComponent = false;


  }

  @HostListener('click')
  clickInside() {
    // this.isFocusInsideComponent = true;
    // this.isComponentClicked = true;
  }
}
