import {Directive, ElementRef, HostListener, Input, Inject} from '@angular/core';
import {Observable, fromEvent} from 'rxjs';

@Directive({
    selector: '[sticky]'
})
export class StickyDirective {
    stickyWidth: number;
    @Input('sticky-class') class: string = 'sticky';


    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        this.subscribeForScrollEvent();
    }

    subscribeForScrollEvent() {
      let obs = fromEvent(window, 'scroll');
      obs.subscribe((e) => this.handleScrollEvent(e));
        // var obs = Observable.fromEvent(window, 'scroll');
        // obs.subscribe((e) => this.handleScrollEvent(e));
    }

    handleScrollEvent(e: any) {

        if (window.pageYOffset > this.el.nativeElement.offsetHeight / 2) {
            this.el.nativeElement.classList.add(this.class);
        } else {
            this.el.nativeElement.classList.remove(this.class);
        }

        if (document.location.pathname.indexOf('dashboard') !== -1) {
          this.el.nativeElement.classList.add('in-dashboard');
        }else{
          this.el.nativeElement.classList.remove('in-dashboard');
        }

        if (document.getElementsByClassName('hide-shadow').length > 0) {
            this.el.nativeElement.style['box-shadow'] = 'none';
        }
    }
}
