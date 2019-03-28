import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'sirius';
  urlSemMenu = ['/login', '/cadastrar-senha'];
  exibeMenu = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged()
    ).subscribe(_ => {
      this.exibeMenu = !this.urlSemMenu.some(u => this.router.url.startsWith(u));
    });
  }
}
