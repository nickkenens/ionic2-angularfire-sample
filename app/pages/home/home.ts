import {Modal, NavController,Page} from 'ionic-angular';
import {Component, OnInit} from 'angular2/core';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Observable';
import {ModalPage} from '../login/login'

import {FirebaseAuth, AuthProviders, AuthMethods } from 'angularfire2';

@Page({
    template: `
        <ion-navbar *navbar>
            <ion-title>
                Home
            </ion-title>
            <ion-buttons end>
                <button (click)="logoutClicked()">
                <ion-icon name="contact"></ion-icon>
                </button>
            </ion-buttons>            
        </ion-navbar>

        <ion-content class="home">
            <ion-item>
                <div *ngIf="auth | async">You are logged in as {{authInfo.email}}</div>
                <div *ngIf="!(auth | async)">Please log in</div>
            </ion-item>
            <ion-card  *ngFor="#item of bookItems | async">
                <ion-card-header>
                    {{item.volumeInfo.title}}
                </ion-card-header>
                <ion-card-content>
                    {{item.volumeInfo.description}}
                </ion-card-content>
            </ion-card>
        </ion-content>`
})
export class HomePage implements OnInit {
    bookItems: Observable<any[]>;
    authInfo: any

    constructor(public af: AngularFire, public auth: FirebaseAuth, public navCtrl: NavController) {

    }
    
    ngOnInit() {
          this.auth.subscribe((data) => {
            console.log("in auth subscribe", data)
            if (data) {
                this.authInfo = data.password
                this.bookItems = this.af.list('/bookItems');
            } else {
                this.authInfo = null
                this.modalClicked()
            }
        })      
    }

    modalClicked() {
        let modal = Modal.create(ModalPage);
        this.navCtrl.present(modal);        
    }
    
    
    logoutClicked() {

        if (this.authInfo && this.authInfo.email) {
            this.auth.logout();
            return;
        }
    }
}
