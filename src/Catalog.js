const PagesList = require("./PagesList");
const c2w = require("cli-to-web");

class Catalog{
    constructor(){
        // contains pageLists
        this.pageLists = [];

        // all Pages possible
        this.companyInfos = [];
    }

    static get LETTERS(){
        return [ "%23", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];
    }
    
    addBaseLink(link){
        for(let i=0; i < Catalog.LETTERS.length; i++){
            const letter = Catalog.LETTERS[i];
            const subLink = link + letter;
            const pageList = new PagesList(subLink);
            this.pageLists.push(pageList);
        }
    }

    async loadAllCompanyInfos(){
        let lastCity = "";
        let lastLetter = "";
        let progressId;
        let letterInCity = 0;
        let city = "";
        for(let i=0; i<this.pageLists.length; i++){
            const pageList = this.pageLists[i];
            city = decodeURI(pageList.baselink.split("/")[7]);
            const letter = pageList.baselink.split("/")[9];
            if(lastCity !== city){
                if(progressId){
                    this.finishProgress(progressId, lastCity);
                }
                lastCity = city;
                progressId = c2w.showProgress("");
                letterInCity = 0;
            }
            if(lastLetter != letter){
                lastLetter = letter;
                letterInCity ++;
            }
            const progress = (letterInCity-1) / Catalog.LETTERS.length * 100;
            const _companyInfos = await pageList.getCompanyInfos(progressId, progress, city, letter);
            this.companyInfos = this.companyInfos.concat(_companyInfos);
        }

        this.finishProgress(progressId, city);
        return this.companyInfos;
    }

    finishProgress(progressId, city){
        c2w.updateProgress(progressId, 100, city + " abgeschlossen");
    }
}

module.exports = Catalog;
