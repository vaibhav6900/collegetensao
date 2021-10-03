import { Component,Renderer,NgZone,NgModule } from '@angular/core';
import { NavController,ModalController, LoadingController } from 'ionic-angular';
import { DataStore } from '../../app/dataStore';
import {LiveUpdateProvider} from "../../providers/live-update/live-update";
import ListComponent from "../../componentScripts/listView";
import { CreateModalPage } from "../../componentScripts/listViewCreateModal";
import { DetailModalPage } from "../../componentScripts/listViewDetailModal";
import { SearchModalPage } from "../../componentScripts/listViewSearchModal";

@Component({
  selector: 'page-college',
  templateUrl: 'college.html'
})

@NgModule({
  providers: [
      LiveUpdateProvider
  ]
})

export class CollegePage {

  constructor(public navCtrl: NavController, public dataStore:DataStore, public liveUpdateService:LiveUpdateProvider, renderer: Renderer, private zone: NgZone, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
      let loader = this.loadingCtrl.create({});
      const searchAttributes = this.getSearchAttributes();
      this.listInputAttributes = this.listViewComponent.getDetailAttributesList({}, searchAttributes, false);
      if(this.dataset){ loader.present();  this.listViewComponent.callAPI(this.baseurl, WLResourceRequest.GET, this.GETLISTPATH, this.listInputAttributes, (err,response) => { this.zone.run(() => { loader.dismiss(); this.responseList=JSON.parse(response); this.filterList=this.responseList;}); });}

  }

    responseList: any;
    filterList: any;
    filterBy = 'All';
    listViewComponent = new ListComponent();
    image = [];
    listInputAttributes = [];

    openCreateModal() {
        let createModal = this.modalCtrl.create(CreateModalPage, { formItems: this.addAttributes, baseurl: this.baseurl, adapterPath: this.POSTADDPATH });createModal.onDidDismiss(() => {this.responseList=null;this.listViewComponent.callAPI(this.baseurl, WLResourceRequest.GET, this.GETLISTPATH, this.listInputAttributes, (err,response) => { this.zone.run(() => {this.responseList=JSON.parse(response);this.filterList=this.responseList;}); });});createModal.present();
    }

    openViewModal(page, item) {
        if(this.checkPermission(page)) {const modalInput = {postPathURL: this.POSTADDPATH,viewPathURL: this.GETVIEWPATH,editPathURL: this.PUTEDITPATH,deletePathURL: this.DELETEPATH,baseurl: this.baseurl,viewItem: {},viewAttributes: this.viewAttributes,editAttributes: this.editAttributes,addAttributes: this.addAttributes,viewTitle: this.title,showPage: 'view'};if(page === 'view') {let loader = this.loadingCtrl.create({});loader.present();let params = this.listViewComponent.getDetailAttributesList(item, this.viewAttributes, false);this.listViewComponent.callAPI(this.baseurl, WLResourceRequest.GET, this.GETVIEWPATH, params, (err,response) => {this.zone.run(() => {loader.dismiss();const viewResponse=JSON.parse(response);modalInput.viewItem = viewResponse;this.openItemModal(modalInput);});});} else {modalInput.showPage = 'add';this.openItemModal(modalInput)}}
    }

    openItemModal(modalInput) {
        let detailModal = this.modalCtrl.create(DetailModalPage, modalInput);detailModal.onDidDismiss(() => {this.responseList=null;let loader = this.loadingCtrl.create({});loader.present();this.listViewComponent.callAPI(this.baseurl,WLResourceRequest.GET,this.GETLISTPATH,this.listInputAttributes, (err,response) => { this.zone.run(() => { loader.dismiss();this.responseList=JSON.parse(response);this.filterList=this.responseList; });});});detailModal.present();
    }

    getDisplayValue(item, attributeList) {
        return this.listViewComponent.getDisplayValue(item, attributeList);
    }

    showDynamicImage() {
        if(this.image && this.image.length > 0) {const imageItem = this.image[0];if(imageItem.key === 'dynamic') { return '1'; } else { return '0'; }} else { return '2'; }
    }

    isShowStatusImage(item) {
        let isShowImage = false;this.status.map((attribute) => {if(attribute.key === 'dynamic') {const {value} = attribute;if(attribute.displayType === 'image') {const nestedAttrList = value.split('.');let attrValue = item;nestedAttrList.map((attr, index) => { attrValue = attrValue[attr];});const {tagImagesObj}= attribute;if(tagImagesObj[attrValue]) {isShowImage= true;}}}});return isShowImage;
    }

    getStatusImage(item) {
        let imageSrc = '';this.status.map((attribute) => {if(attribute.key === 'dynamic') {const {value} = attribute;if(attribute.displayType === 'image') {const nestedAttrList = value.split('.');let attrValue = item;nestedAttrList.map((attr, index) => { attrValue = attrValue[attr];});const {tagImagesObj}= attribute;if(tagImagesObj[attrValue]) {imageSrc = 'assets/imgs/statusIcons/'+tagImagesObj[attrValue];}}}});return imageSrc;
    }

    getFilterKeys() {
        let filterList = ['All'];if(this.status.length > 0) {this.status.map((attribute) => {if(attribute.enum && attribute.enum.length > 0) {attribute.enum.map((enumvale) => {filterList.push(enumvale);});}});}return filterList;
    }

    filterListAction($event) {
        this.filterList =[];if( $event === 'All') {this.filterList = this.responseList;} else {this.responseList.map((listItem) => {const statusVal = this.getDisplayValue(listItem, this.status);if(statusVal.toString() === $event) {this.filterList.push(listItem);}});}
    }

    checkPermission(actionType) {
        if(actionType === 'add') {if(this.POSTADDPATH) {return true;}} else if(actionType === 'view') {if(this.GETVIEWPATH) {return true;}}return false;
    }

    openSearchModal() {
        const searchAttributes = this.getSearchAttributes();const modalInput = {searchAttributes};let searchModal = this.modalCtrl.create(SearchModalPage, modalInput);searchModal.onDidDismiss((inputAttributes) => {if(inputAttributes) {this.listInputAttributes = inputAttributes;this.responseList=null;let loader = this.loadingCtrl.create({});loader.present();this.filterBy = 'All';this.listViewComponent.callAPI(this.baseurl,WLResourceRequest.GET,this.GETLISTPATH,this.listInputAttributes, (err,response) => { this.zone.run(() => { loader.dismiss();this.responseList=JSON.parse(response);this.filterList=this.responseList;});});}});searchModal.present();
    }

    checkIsSearchable() {
        const searchAttributes = this.getSearchAttributes();if(searchAttributes.length > 0) {return true;}return false;
    }

    getSearchAttributes() {
        let attributesList = [];if(this.GETLISTPATH) {const verbObj = this.GETLISTPATH.verbRequestInfo;if(verbObj) {const queryAttributes = verbObj.queryAttributes;const pathAttributes = verbObj.pathAttributes;attributesList = queryAttributes.concat(pathAttributes);}}return attributesList;
    }

    ListtypeId = "listType_1";
    listTitle = "COLLEGE DETAILS";
    DELETEPATH = "";
    POSTADDPATH = "";
    addAttributes = [];
    dataset = "worklist";
    baseurl = "/adapters/Worklist";
    GETLISTPATH = {"path":"/workitems","verbRequestInfo":{"queryAttributes":[],"pathAttributes":[],"formdataAttributes":[],"bodyAttributes":[],"headerAttributes":[],"dsMoreInfo":{"produces":["application/json"],"consumes":["*/*"],"responseObj":{"200":{"description":"successful operation","schema":{"type":"array","items":{"type":"object","properties":{"description":{"type":"string","name":"description"},"location":{"type":"string","name":"location"},"notes":{"type":"string","name":"notes"},"completed":{"type":"boolean","default":false,"name":"completed"},"rev":{"type":"string","name":"rev"},"id":{"type":"string","name":"id"}}}},"headers":{}}},"bodyList":[],"foreignkey":"GPGZPaYlJap5pRoy","dskey":"wed6ESMgvw0EH0UL","_id":"r2U96XaMS1SfJ3xk"}}};
    title = [{"idx":0,"key":"dynamic","value":"description","displayType":"text","displayname":"description","tagImagesObj":{}}];
    subtitle = [{"idx":0,"key":"dynamic","value":"location","displayType":"text","displayname":"location","tagImagesObj":{}}];
    status = [{"idx":0,"key":"dynamic","value":"completed","displayType":"text","displayname":"completed","tagImagesObj":{},"enum":["true","false"]}];
    filterAttribute = 'true';
    GETVIEWPATH = {"path":"/workitems/{id}","verbRequestInfo":{"queryAttributes":[],"pathAttributes":[{"name":"id","displayname":"id","parampath":"id","type":"text","required":true,"usage":true,"in":["path","response"],"displayin":["path","response"],"foreignkey":"CJHNEVSDPKvDk4MS","dskey":"wed6ESMgvw0EH0UL","_id":"tv49Od6gSZSQaxI1"}],"formdataAttributes":[],"bodyAttributes":[],"headerAttributes":[],"dsMoreInfo":{"produces":["application/json"],"consumes":["*/*"],"responseObj":{"200":{"description":"successful operation","schema":{"type":"object","properties":{"description":{"type":"string","name":"description"},"location":{"type":"string","name":"location"},"notes":{"type":"string","name":"notes"},"completed":{"type":"boolean","default":false,"name":"completed"},"rev":{"type":"string","name":"rev"},"id":{"type":"string","name":"id"}}},"headers":{}}},"bodyList":[],"foreignkey":"CJHNEVSDPKvDk4MS","dskey":"wed6ESMgvw0EH0UL","_id":"CQ8CPoZm2jxoYCTY"}}};
    viewAttributes = [{"displayname":"id","name":"id","parampath":"id","required":true,"type":"text","show":"hide"},{"displayname":"completed","name":"completed","parampath":"completed","required":false,"type":"boolean","show":"show"},{"displayname":"description","name":"description","parampath":"description","required":false,"type":"text","show":"show"},{"displayname":"location","name":"location","parampath":"location","required":false,"type":"text","show":"show"},{"displayname":"notes","name":"notes","parampath":"notes","required":false,"type":"text","show":"show"},{"displayname":"rev","name":"rev","parampath":"rev","required":false,"type":"text","show":"hide"}];
    PUTEDITPATH = {"path":"/workitems/{id}","verbRequestInfo":{"queryAttributes":[],"pathAttributes":[{"name":"id","displayname":"id","parampath":"id","type":"text","required":true,"usage":true,"in":["path","body"],"displayin":["path","body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"luTXDzES45NYlJ7J"}],"formdataAttributes":[],"bodyAttributes":[{"name":"id","displayname":"id","parampath":"id","type":"text","required":true,"usage":true,"in":["path","body"],"displayin":["path","body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"luTXDzES45NYlJ7J"},{"name":"completed","displayname":"completed","parampath":"completed","type":"boolean","required":false,"default":false,"usage":true,"in":["body"],"displayin":["body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"4lagTXLvn7abP717"},{"name":"description","displayname":"description","parampath":"description","type":"text","required":false,"usage":true,"in":["body"],"displayin":["body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"wx6PKZ0ITVIGGIpv"},{"name":"location","displayname":"location","parampath":"location","type":"text","required":false,"usage":true,"in":["body"],"displayin":["body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"QnT9EOCjib1tOzyK"},{"name":"notes","displayname":"notes","parampath":"notes","type":"text","required":false,"usage":true,"in":["body"],"displayin":["body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"KjkatKEWpCUuQ94C"},{"name":"rev","displayname":"rev","parampath":"rev","type":"text","required":false,"usage":true,"in":["body"],"displayin":["body"],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"4Ly2SyiZJBdatMhQ"}],"headerAttributes":[],"dsMoreInfo":{"produces":["*/*"],"consumes":["application/json"],"responseObj":{"default":{"description":"successful operation"}},"bodyList":[{"in":"body","name":"body","required":false,"schema":{"type":"object","properties":{"description":{"type":"string","name":"description"},"location":{"type":"string","name":"location"},"notes":{"type":"string","name":"notes"},"completed":{"type":"boolean","default":false,"name":"completed"},"rev":{"type":"string","name":"rev"},"id":{"type":"string","name":"id"}}}}],"foreignkey":"swCDkpbibpP73ZmD","dskey":"wed6ESMgvw0EH0UL","_id":"R0FjeeAANT0tmOee"}}};
    editAttributes = [{"displayname":"id","name":"id","parampath":"id","required":true,"type":"text","show":"hide"},{"displayname":"completed","name":"completed","parampath":"completed","required":false,"type":"boolean","show":"edit"},{"displayname":"description","name":"description","parampath":"description","required":false,"type":"text","show":"edit"},{"displayname":"location","name":"location","parampath":"location","required":false,"type":"text","show":"edit"},{"displayname":"notes","name":"notes","parampath":"notes","required":false,"type":"text","show":"edit"},{"displayname":"rev","name":"rev","parampath":"rev","required":false,"type":"text","show":"edit"}];

    ionViewDidLoad() {
        WL.Analytics.log({ fromPage: this.navCtrl.getPrevious(this.navCtrl.getActive()).name, toPage: this.navCtrl.getActive().name }, 'PageTransition ');
        WL.Analytics.send();
    }
}