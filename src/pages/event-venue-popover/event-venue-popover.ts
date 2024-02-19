import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the EventVenuePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-venue-popover',
  templateUrl: 'event-venue-popover.html',
})
export class EventVenuePopoverPage {
  public eventVenue: string;
  public eventLocation: string;
  public eventName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private launchNavigator: LaunchNavigator,
    private socialSharing: SocialSharing
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventVenuePopoverPage');
  }

  ionViewWillEnter(){
    const eventData= this.navParams.get('data');
     this.eventVenue = eventData.hasOwnProperty('venue') ? eventData.venue : eventData.event_venue;
     this.eventLocation = eventData.hasOwnProperty('location') ? eventData.location : eventData.event_location;
     this.eventName = eventData.event_name
  }

    /************ navigating user to google maps ***********/
    navigateToMaps(venue: any) {
      this.launchNavigator.navigate(venue)
      .then(
        success => console.log('Launched navigator' + success),
        error => console.log('Error launching navigator', error)
      );
    }

    /************ sharing venue details ***********/
    shareVenueDetails(venue: any) {
          console.log(venue)
          this.socialSharing.share(venue).then(() => {
            // Sharing via email is possible
          }).catch(() => {
            // Sharing via email is not possible
          });
    }

}
