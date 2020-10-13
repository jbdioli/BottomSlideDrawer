import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import { Gesture, GestureConfig, GestureController} from '@ionic/angular';
import { fromEvent, merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-slide-drawer',
  templateUrl: './bottom-slide-drawer.component.html',
  styleUrls: ['./bottom-slide-drawer.component.scss'],
})
export class BottomSlideDrawerComponent implements OnInit, AfterViewInit, OnDestroy {

  observer: Subscription;

  @Output() isCloseEvent = new EventEmitter<{ isClose: boolean}>();

  handleHeight = 0.84;
  state = 'goUp';
  isUp = false;

  windowHeight = window.innerHeight; // get the screen size
  drawerHeight: number;

  className: string;

  constructor(
    private gestureCtrl: GestureController,
    private elmentRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.drawerHeight = this.windowHeight * this.handleHeight;
    this.className = this.elmentRef.nativeElement.childNodes[0];

    console.log('elmentRef', this.elmentRef);
    console.log('class name', this.className);
  }

  async ngAfterViewInit() {


    console.log('drawerHeight', this.drawerHeight);

    this.renderer.setStyle(this.elmentRef.nativeElement, 'top', this.drawerHeight + 'px');

    this.renderer.setStyle(this.className, 'min-height', this.windowHeight + 'px');

    const options: GestureConfig = {
      el: this.elmentRef.nativeElement,
      direction: 'y',
      gestureName: 'bottom-slide-drawer-swipe',
      onStart: () => {
        this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', 'none');

      },
      onMove: (ev) => {
        // if I go up apply style
        if (ev.deltaY < 0 && this.state === 'goUp') {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(${ev.deltaY}px)`);

          // if I go down apply style
        } else if (ev.deltaY > 0 && this.state === 'goDown') {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(calc(${ev.deltaY}px - ${this.drawerHeight}px))`);
        }

        // give the slider direction
        const refY = ev.deltaY;
        setTimeout(() => {
          if ( refY > ev.deltaY) {
            console.log('goUp');
            this.state = 'goUp';
          }
          if ( refY < ev.deltaY) {
            console.log('goDown');
            this.state = 'goDown';
          }
        }, 33);



      },
      onEnd: (ev) => {
        // do something when the gesture ends
        this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', '0.5s ease-out');

        if (ev.deltaY < -(this.windowHeight / 20) && this.state === 'goUp') {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(-${this.drawerHeight}px)`);
          this.state = 'goDown';
        } else {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', 'translateY(0px)');
          this.state = 'goUp';
          this.isUp = false;
        }
      }

    };

    const gesture: Gesture = await this.gestureCtrl.create(options);
    gesture.enable();
  }

  onClick() {
    if (!this.isUp) {
      this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', '0.5s ease-out');
      this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(-${this.drawerHeight}px)`);
      this.isUp = true;
    }
  }


  onClose() {
    this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', '0.5s ease-out');
    this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', 'translateY(0px)');

    this.observer = merge(
      fromEvent(this.elmentRef.nativeElement, 'transitionstart').pipe(mapTo('start')),
      fromEvent(this.elmentRef.nativeElement, 'transitionend').pipe(mapTo('end'))
    ).subscribe(phase => {
      console.log('Transition phase:', phase);

      if (phase ===  'end') {
        this.isCloseEvent.emit({isClose: true});
      }
    });


    // this.observer = fromEvent(this.elmentRef.nativeElement, 'transitionstart').subscribe((event) => {
    //   console.log('Started transition:', event);
    // });
  }


  ngOnDestroy() {
    this.observer.unsubscribe();
  }

}
