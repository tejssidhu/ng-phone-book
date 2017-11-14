import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
  <nav-bar></nav-bar>
  <router-outlet></router-outlet>
`
})
export class AppComponent {
  constructor() {

  }
}
