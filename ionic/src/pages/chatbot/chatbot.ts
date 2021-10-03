import { Component,Renderer,NgZone,NgModule } from '@angular/core';
import { NavController,ModalController, LoadingController } from 'ionic-angular';
import { DataStore } from '../../app/dataStore';
import {LiveUpdateProvider} from "../../providers/live-update/live-update";
import WatsonChat from "../../componentScripts/chat";
import { Platform } from "ionic-angular";
import { ElementRef } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: 'page-chatbot',
  templateUrl: 'chatbot.html'
})

@NgModule({
  providers: [
      LiveUpdateProvider
  ]
})

export class ChatbotPage {

  constructor(public navCtrl: NavController, public dataStore:DataStore, public liveUpdateService:LiveUpdateProvider, renderer: Renderer, private zone: NgZone, private cdr: ChangeDetectorRef, public platform: Platform, public elem: ElementRef) {
      this.watsonChat.init(this.url,this.iam_apikey,this.workspaceId,eval('this.shouldSendWatsonAssistantAnalytics'));
      platform.ready().then(() => {this.message()});

  }

    messages = [];
    input: any;
    watsonChat = new WatsonChat();
    pageTagName: any;

    message() {
        this.watsonChat.sendMessage(this.messages, this.input,(err,msgs)=>{ this.zone.run(() => { this.messages = msgs; this.input=''; }); });this.cdr.detectChanges();
    }

    ionViewDidLoad() {
        this.pageTagName = this.elem.nativeElement.tagName.toLowerCase();const scrollContentSelector = this.pageTagName + ' .scroll-content';const scrollElement:HTMLElement =  document.querySelector(scrollContentSelector) as HTMLElement;scrollElement.style.overflow = 'hidden';
        WL.Analytics.log({ fromPage: this.navCtrl.getPrevious(this.navCtrl.getActive()).name, toPage: this.navCtrl.getActive().name }, 'PageTransition ');
        WL.Analytics.send();
    }

    url = "https://api.eu-gb.assistant.watson.cloud.ibm.com/instances/5d0a66d1-b152-485e-b667-ad9ed3c20838";
    iam_apikey = "v8gyMkBJoR_M-3bGqDlOT6DfaNezhW8olbTyrcFfuTyL";
    workspaceId = "4ae7c461-67a6-4a06-86f7-80208f8186d4";
    shouldSendWatsonAssistantAnalytics = true;
}