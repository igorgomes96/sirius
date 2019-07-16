import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[telefone]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TelefoneDirective,
    multi: true
  }]
})
export class TelefoneDirective implements ControlValueAccessor {

  onTouched: any;
  onChange: any;

  constructor(private element: ElementRef) { }

  writeValue(obj: any): void {
    if (!obj) {
      this.element.nativeElement.value = '';
      return;
    }
    this.element.nativeElement.value = this.telefoneComMascara(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event: any) {
    const inputValue = $event.target.value;
    if (!inputValue) {
      return;
    }
    const numbers = this.getNumbers(inputValue);
    if (numbers.length > 10) {
      if ([46, 8, 9, 27, 13, 110, 149, 190].indexOf($event.keyCode) !== -1 ||
        // Allow: Ctrl+A
        ($event.keyCode === 65 && ($event.ctrlKey || $event.metaKey)) ||
        // Allow: Ctrl+C
        ($event.keyCode === 67 && ($event.ctrlKey || $event.metaKey)) ||
        // Allow: Ctrl+V
        ($event.keyCode === 86 && ($event.ctrlKey || $event.metaKey)) ||
        // Allow: Ctrl+X
        ($event.keyCode === 88 && ($event.ctrlKey || $event.metaKey)) ||
        // Allow: home, end, left, right
        ($event.keyCode >= 35 && $event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      $event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    const inputValue = $event.target.value;
    if (!inputValue) {
      this.onChange('');
      return;
    }
    $event.target.value = this.telefoneComMascara(inputValue);
    const numbers = this.getNumbers(inputValue);
    if (numbers.length >= 8 && numbers.length <= 11) {
      this.onChange(numbers);
    } else {
      this.onChange('');
    }
  }

  telefoneComMascara(inputValue: string): string {
    if (!inputValue) {
      this.onChange('');
      return;
    }
    const numbers = this.getNumbers(inputValue);
    switch (numbers.length) {
      case 1:
      case 2:
      case 3:
      case 4:
        return numbers;
      case 5:
      case 6:
      case 7:
      case 8:
        return `${numbers.substr(0, 4)}-${numbers.substr(4)}`;
      case 9:
        return `${numbers.substr(0, 1)} ${numbers.substr(1, 4)}-${numbers.substr(5)}`;
      case 10:
        return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 4)}-${numbers.substr(6)}`;
      case 11:
        return `(${numbers.substr(0, 2)}) ${numbers.substr(2, 1)} ${numbers.substr(3, 4)}-${numbers.substr(7)}`;
    }
    return '';
  }

  getNumbers(valor: string): string {
    if (!valor) {
      return '';
    }
    const numbers = valor.match(/\d/g);
    if (!numbers) {
      return '';
    }
    return numbers.join('') as string;
  }


}
