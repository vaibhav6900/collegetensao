import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DataStore } from './dataStore';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LiveUpdateProvider } from '../providers/live-update/live-update';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChatbotPage } from "../pages/chatbot/chatbot";
import { CollegePage } from "../pages/college/college";
import { CreateModalPage } from "../componentScripts/listViewCreateModal";
import { DetailModalPage } from "../componentScripts/listViewDetailModal";
import { SearchModalPage } from "../componentScripts/listViewSearchModal";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ,ChatbotPage,CollegePage,CreateModalPage,DetailModalPage,SearchModalPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ,ChatbotPage,CollegePage,CreateModalPage,DetailModalPage,SearchModalPage],
  providers: [
    StatusBar,
    SplashScreen,
    DataStore,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LiveUpdateProvider
  ]
})
export class AppModule {}
