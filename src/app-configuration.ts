import { Injectable } from '../node_modules/@angular/core';

@Injectable()
export class AppConfiguration {
  public environment = 'dev';
  public token: string;
  public url: string;
  public forgot_password_url: string;
  public sign_up_url: string;
  public domain: string;

  constructor() {
   if (this.environment == 'dev') {
      this.token = 'testhandshak';
      this.url = 'https://api-dev-aws.locallevelevents.com/v1';
      this.forgot_password_url = '/users/login?type=3';
      this.sign_up_url = '/users/login?type=2';
      this.domain = 'testll.dbscart.com';
    } else if (this.environment == 'QA') {
      this.token = 'testhandshak';
      this.url = 'https://api-qa-aws.locallevelevents.com/v1';
      this.forgot_password_url = '/users/login?type=3';
      this.sign_up_url = '/users/login?type=2';
      this.domain = 'testll.dbscart.com';
    }
     else if (this.environment == 'beta') {
      this.token = 'testhandshak';
      this.url = 'https://api-beta-aws.locallevelevents.com/v1';
      this.forgot_password_url = '/users/login?type=3';
      this.sign_up_url = '/users/login?type=2';
      this.domain = 'beta.locallevelevents.com';
    }  else if (this.environment == 'live') {
      this.token = 'testhandshak';
      this.url = 'https://api.locallevelevents.com/v1';
      this.forgot_password_url = '/users/login?type=3';
      this.sign_up_url = '/users/login?type=2';
      this.domain = 'www.locallevelevents.com';
    }
   
  }
}
