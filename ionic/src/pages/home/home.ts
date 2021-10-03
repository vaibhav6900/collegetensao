import { Component, Renderer, NgZone } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { DataStore } from "../../app/dataStore";
import { ChatbotPage } from "../chatbot/chatbot";
import { CollegePage } from "../college/college";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(public navCtrl: NavController,public renderer:Renderer, public dataStore: DataStore) {}

    home_Button_280_clickHandler() {
        this.navCtrl.push( ChatbotPage, {
                data: {"a":"a"}
              });
    }

    home_Button_8110_clickHandler() {
        this.navCtrl.push( CollegePage, {
                data: {"a":"a"}
              });
    }
}
