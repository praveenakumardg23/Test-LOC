import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { IonicPage, ModalController, NavParams, ViewController,LoadingController } from 'ionic-angular';
import { DataService } from '../services/data-services/data-service';
import { TicketValidationPopupPage } from '../ticket-validation-popup/ticket-validation-popup';

/**
 * Generated class for the TicketTransferPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticket-transfer-popup',
  templateUrl: 'ticket-transfer-popup.html',
})
export class TicketTransferPopupPage implements OnInit {

  type = 'Email';
  emailData: string;
  textData: any;
  @ViewChild('f') ngForm: NgForm;
  transferTicketForm: FormGroup;
  reqObj: any;
  displayErrorMessage = false;
  loader = false;
  constructor(
    private navParams: NavParams,
    private view: ViewController,
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private dataService: DataService,
    public loadingCtrl: LoadingController,

  ) {
  }

  ngOnInit() {
    this.transferTicketForm = this.formBuilder.group({
      type: ['', []],
      email: ['', [Validators.required, Validators.email]],
      text: ['', [Validators.required]]
    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DeviceValidationPopupPage');
  }

  ionViewWillEnter() {
    this.reqObj = this.navParams.get('data');
  }

  onSelect(type) {
    console.log(type);
  }

  onSend() {
    const isInvalidEmail = !(/(.+)@(.+){2,}\.(.+){2,}/.test(this.transferTicketForm.value.email));
    const isInvalid = (this.type == 'Email' ? isInvalidEmail : this.transferTicketForm.get('text').invalid);
    if (isInvalid) {
      this.displayErrorMessage = true;
    } else {
      if (this.transferTicketForm.value.type == 'Email') {
        this.reqObj.email_id = this.transferTicketForm.value.email;
        this.loader = true;
        this.dataService.shareTickets(this.reqObj).subscribe(
          (response: any) => {
            this.loader = false;
            if (response.body.status == 'success') {
              this.popup(true, response.body.message);
            } else if (response.body.status == 'error') {
              this.popup(false, response.body.message);
            }
            this.view.dismiss({
              dismissvalue: response.body.status,
              value:this.reqObj.email_id,
            });
          },
          (error) => {
            this.loader = false;
            console.log(error);
          });
      } else {
        this.reqObj.phone_number = this.transferTicketForm.value.text;
        this.loader = true;
        this.dataService.TransferTicketsSMS(this.reqObj).subscribe(
          (response: any) => {
            this.loader = false;
            if (response.body.status == 'success') {
              this.popup(true, response.body.message);
            } else if (response.body.status == 'error') {
              this.popup(false, response.body.message);
            }
            this.view.dismiss({
              dismissvalue: response.body.status,
              value:this.reqObj.phone_number
            });
          },
          (error) => {
            console.log(error);
            this.loader = false;
          });
      }
    }
  }

  popup(status: boolean, message: string) {
    const deviceValidationModal = this.modal.create(TicketValidationPopupPage, { data: status, message: message });
    deviceValidationModal.present();
  }

  onInputChange(type: string, input: any) {
    this.displayErrorMessage = false;
    if (type == 'Text') {
      if (!(input.key == 'Backspace')) {
        if ((input.shiftKey || (input.keyCode < 48 || input.keyCode > 57)) && (input.keyCode < 96 || input.keyCode > 105)) {
          input.preventDefault();
        }
      }

      let newVal = input.target.value.replace(/\D/g, '');
      newVal = newVal.replace(/[^0-9]*/g, '');

      if (!(input.key == 'Backspace') && newVal.length == 10) {
        input.preventDefault();
      }
      if (input.key == 'Backspace' && newVal.length <= 6) {
        newVal = newVal.substring(0, newVal.length - 1);
      }
      if (newVal.length === 0) {
        newVal = '';
      } else if (newVal.length == 3) {
        newVal = newVal.replace(/^(\d{0,3})/, '($1)');
      } else if (newVal.length <= 10) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1)-$2-$3');
      } else {
        newVal = newVal.substring(0, 9);
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1)-$2-$3');
      }
      this.transferTicketForm.controls.text.patchValue(newVal);
    }
  }

  closemodal(ev, data) {
    if (ev.direction == 8 || data == true) {
      this.view.dismiss();
    }
  }

}
