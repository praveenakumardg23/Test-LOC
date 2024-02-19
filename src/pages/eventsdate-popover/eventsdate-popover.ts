import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform  } from 'ionic-angular';

/**
 * Generated class for the EventsdatePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventsdate-popover',
  templateUrl: 'eventsdate-popover.html',
})
export class EventsdatePopoverPage implements OnInit {
  public eventDates;
  public eventName;
  public isAndroid;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public plt: Platform
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsdatePopoverPage');
  }

  ionViewWillEnter(){
    const eventDates= this.navParams.get('data');
    this.eventName = eventDates.event_name;
    this.eventDates = eventDates.event_date_time
  }

  ngOnInit() {
    this.isAndroid = this.plt.is('android')
  }

}
