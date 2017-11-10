import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
  <nav-bar></nav-bar>
  <router-outlet></router-outlet>
`//, 
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    
  }
}
