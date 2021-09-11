var request = require('request');
var htmlparser = require('htmlparser2');
var select = require('soupselect').select;
const DOMLoader = require('./DOMLoader');

class CompanyInfo{
    constructor(link){
        this.link = link;
        this.htmlContent = null;
        this.name = null;
        this.steet = null;
        this.phone = null;
    }

    async load(){
        const domLoader = new DOMLoader();
        const dom = await domLoader.getDOM(this.link);
        this.extractName(dom);
        this.extractStreet(dom);
        this.extractPhone(dom);
    }

    extractStreet(dom){
        var collection = select(dom, '.mod-TeilnehmerKopf__adresse-daten');
        collection.forEach( ( span ) => {
            span.children.forEach( ( spanContent, i ) => {
                const data = spanContent.data;
                if(this.isPLZ(data)){
                    this.plz = data;
                }else{
                    this.street = data;
                }
            });
        });
    }

    isPLZ(plz){
        const has5Digits = plz.length === 6 || plz.length === 5;
        const endsWithSpace = plz[plz.length - 1] === " ";
        const containsDigitsOnly = parseInt(plz) + " " === plz;
        return has5Digits && endsWithSpace && containsDigitsOnly;
    }

    extractName(dom){
        var collection = select(dom, '.mod-TeilnehmerKopf__name');
        collection.forEach( ( span ) => {
            span.children.forEach( ( spanContent, i ) => {
                const data = spanContent.data;
                this.name = data;
            });
        });
    }
    
    extractPhone(dom){
        var collection = select(dom, '.mod-TeilnehmerKopf--secret_suffix');
        collection.forEach( ( span ) => {
            span.children.forEach( ( spanContent, i ) => {
                const data = spanContent.data;
                this.phone = data;
            });
        });
    }

    getObject(){
        return {
            name: this.name,
            link: this.link,
            street: this.street,
            plz: this.plz,
            phone: this.phone,
        }
    }
}
module.exports = CompanyInfo;