import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2} from '@angular/core';
import { Gesture, GestureConfig, GestureController} from '@ionic/angular';
import { fromEvent, merge, Subscription } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-slide-drawer',
  templateUrl: './bottom-slide-drawer.component.html',
  styleUrls: ['./bottom-slide-drawer.component.scss'],
})
export class BottomSlideDrawerComponent implements OnInit, AfterViewInit {

  observer: Subscription;

  @Output() isCloseEvent = new EventEmitter<{ isClose: boolean}>();

  handleHeight = 0.9;
  state = 'bottom';

  className: any;

  constructor(
    private gestureCtrl: GestureController,
    private elmentRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.className = this.elmentRef.nativeElement.childNodes[0];
    console.log('elmentRef', this.elmentRef);
    console.log('class name', this.className);
  }

  async ngAfterViewInit() {
    const windowHeight = window.innerHeight; // get the screen size
    const drawerHeight = windowHeight * this.handleHeight;

    console.log('drawerHeight', drawerHeight);

    this.renderer.setStyle(this.elmentRef.nativeElement, 'top', drawerHeight + 'px');

    this.renderer.setStyle(this.className, 'min-height', windowHeight + 'px');

    const options: GestureConfig = {
      el: this.elmentRef.nativeElement,
      direction: 'y',
      gestureName: 'bottom-slide-drawer-swipe',
      onStart: () => {
        this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', 'none');

      },
      onMove: (ev) => {
        // if I go up apply style
        if (ev.deltaY < 0 && this.state === 'bottom') {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(${ev.deltaY}px)`);

          // if I go down apply style
        } else if (ev.deltaY > 0 && this.state === 'top') {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(calc(${ev.deltaY}px - ${drawerHeight}px))`);
        }

        const refY = ev.deltaY;
        setTimeout(() => {
          if ( refY > ev.deltaY) {
            console.log('bottom');
            this.state = 'bottom';
          }
          if ( refY < ev.deltaY) {
            console.log('top');
            this.state = 'top';
          }
        }, 33);



      },
      onEnd: (ev) => {
        // do something when the gesture ends
        this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', '0.5s ease-out');

        if (ev.deltaY < -(windowHeight / 20) && this.state === 'bottom') {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', `translateY(-${drawerHeight}px)`);
          this.state = 'top';
        } else {
          this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', 'translateY(0px)');
          this.state = 'bottom';
        }
      }

    };

    const gesture: Gesture = await this.gestureCtrl.create(options);
    gesture.enable();
  }


  onClose() {
    this.renderer.setStyle(this.elmentRef.nativeElement, 'transition', '0.5s ease-out');
    this.renderer.setStyle(this.elmentRef.nativeElement, 'transform', 'translateY(0px)');

    this.observer = merge(
      fromEvent(this.elmentRef.nativeElement, 'transitionstart').pipe(mapTo('start')),
      fromEvent(this.elmentRef.nativeElement, 'transitionend').pipe(mapTo('end'))
    ).subscribe(phase => {
      if (phase ===  'end') {
        this.isCloseEvent.emit({isClose: true});
        console.log('end');
      }
      console.log('Transition phase:', phase);
    });

    // this.observer.unsubscribe();


    // console.log('elmentRef ', this.ionCard);
    // this.observer = fromEvent(this.elmentRef.nativeElement, 'transitionstart').subscribe((event) => {
    //   console.log('Started transition:', event);
    // });
  }




}
