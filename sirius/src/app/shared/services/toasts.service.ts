import { Injectable } from '@angular/core';

declare var M: any;

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor() { }

  toast(msg: string) {
    M.toast({html: msg});
  }
}
