import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@autoinject
export class AvailControl {
  

  constructor(private http: HttpClient) {
  
  }

  activate() {

  }
}
