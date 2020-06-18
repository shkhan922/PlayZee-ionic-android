import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SetgetProvider {

  value;

  constructor(public http: HttpClient) {
    console.log('Hello SetgetProvider Provider');
  }

  set(val) {
    this.value = val;
  }

  get() {
    return this.value;
  }

}
