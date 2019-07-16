import { Directive, Input, HostListener } from '@angular/core';
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

  @Input() telefoneMask: string;

  constructor() { }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  @HostListener('keyup', ['$event'])
  onKeyup($event: any) {
    let valor = $event.target.value.replace(/\D/g, '');
    const pad = this.telefoneMask.replace(/\D/g, '').replace(/9/g, '_');
    const valorMask = valor + pad.substring(0, pad.length - valor.length);

    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }

    if (valor.length <= pad.length) {
      this.onChange(valor);
    }

    let valorMaskPos = 0;
    valor = '';
    for (let i = 0; i < this.telefoneMask.length; i++) {
      // tslint:disable-next-line:radix
      if (isNaN(parseInt(this.telefoneMask.charAt(i)))) {
        valor += this.telefoneMask.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }

    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }

    $event.target.value = valor;
  }

  @HostListener('blur', ['$event'])
  onBlur($event: any) {
    if ($event.target.value.length === this.telefoneMask.length) {
      return;
    }
    this.onChange('');
    $event.target.value = '';
  }

}
