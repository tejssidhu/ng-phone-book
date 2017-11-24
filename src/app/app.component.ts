import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
  <app-navbar></app-navbar>
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
