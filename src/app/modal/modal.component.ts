import { Component, ComponentFactoryResolver, Directive, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService, ShowItem } from '../modal.service';

@Directive({
  selector: '[modal-host]',
})
export class ModalDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

export interface ModalValue {
  callback:(any)=>void;
  close:()=>void;
  params:any;
  onInit();
}

@Component({
  selector: 'app-modal',
  template: `
  <div (click)="onContainerClicked($event)" class="modal fade" tabindex="-1" [ngClass]="{'in': visibleAnimate}"
       [ngStyle]="{'display': visible ? 'block' : 'none', 'opacity': visibleAnimate ? 1 : 0}">
    <div class="modal-dialog">
      <div class="modal-content">
        <ng-template modal-host></ng-template>
      </div>
    </div>
  </div>
  `
})
export class ModalComponent{

  public visible = false;
  public visibleAnimate = false;
  @ViewChild(ModalDirective) modalHost:ModalDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,private modal:ModalService){
    this.modal.show.subscribe(value => {
      this.show(value);
    })
  }

  public show(item:ShowItem): void {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
    let viewContainerRef = this.modalHost.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    (<ModalValue>componentRef.instance).callback = item.callback;
    (<ModalValue>componentRef.instance).params = item.params;
    let modal = this;
    (<ModalValue>componentRef.instance).close = ()=>{modal.hide()};
    (<ModalValue>componentRef.instance).onInit();
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}

