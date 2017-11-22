import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
  <nav-bar></nav-bar>
  <div class="contatiner">
    <router-outlet></router-outlet>
  </div>
`
})
export class AppComponent {
  public viewContainerRef: ViewContainerRef;

  public constructor(public toastr: ToastsManager, viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;

    this.toastr.setRootViewContainerRef(viewContainerRef);
  }
}
