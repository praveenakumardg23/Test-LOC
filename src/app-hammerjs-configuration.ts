import * as Hammer from 'hammerjs';
import {HammerGestureConfig} from '@angular/platform-browser';

export class AppHammerConfig extends HammerGestureConfig {
  overrides = {
    'swipe': {direction: Hammer.DIRECTION_ALL}
  }
}
