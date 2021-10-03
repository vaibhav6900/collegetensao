import { Component, ViewChild, Renderer, ChangeDetectorRef,NgModule } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LiveUpdateProvider } from "../providers/live-update/live-update";
import { ChatbotPage } from "../pages/chatbot/chatbot";
import { CollegePage } from "../pages/college/college";

@Component({
  templateUrl: 'app.html'
})

@NgModule({
  providers: [
      LiveUpdateProvider
  ]
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private renderer: Renderer, private cdr: ChangeDetectorRef,private liveUpdateService:LiveUpdateProvider) {
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      this.initializeApp(renderer, cdr);
    });

    // used for an example of ngFor and navigation
    this.pages = [
                  { title: 'Home', component: HomePage } ,{title:'chatbot', component: ChatbotPage} ,{title:'college', component: CollegePage}
                ];
      renderer.listenGlobal('document', 'mfpjsloaded', () => { WL.Analytics.enable();});

  }

  initializeApp(renderer, cdr) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = HomePage;
      cdr.detectChanges();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
