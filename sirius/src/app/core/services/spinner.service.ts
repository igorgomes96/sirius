import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private _showSpinnerEmitter = new EventEmitter<boolean>();
  constructor() { }

  showSpinner(show: boolean) {
    this._showSpinnerEmitter.emit(show);
  }

  get showSpinnerEmitter(): EventEmitter<boolean> {
    return this._showSpinnerEmitter;
  }
}
