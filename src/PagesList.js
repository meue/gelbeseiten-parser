const Page = require("./Page");
const DOMLoader = require("./DOMLoader");
const select = require('soupselect').select;
const CompanyInfo = require("./CompanyInfo");
const c2w = require("cli-to-web");

class PagesList{
    // link = "https://www.gelbeseiten.de/branchenbuch/staedte/Th%C3%BCringen/Kreisfrei/Gera/unternehmen/a"
    constructor(baseLink){
        /** @type {Array.<String>} */ this.links = [];
        /** @type {Array.<CompanyInfo>} */ this.companyInfos = [];
        this.baselink = baseLink;
        this.firstLink = baseLink + "?page=1";
    }

    async getCompanyInfos(progressId, mainProgress, city, letter){
        const dom = await this.loadPage(this.firstLink);
        this.getLinks(dom);
        for(let i=0; i<this.links.length; i++){
            const progress = (i / this.links.length) / 28 * 100;
            let totalProgress = progress + mainProgress;
            if(totalProgress > 100){
                totalProgress = 100;
            }
            c2w.updateProgress(progressId, totalProgress, "Firmen in <b>" + city + "</b> mit dem Anfangsbuchstaben <b>" + letter + "</b>, Seite <b>" + (i+1)+"</b>");
            const page = new Page(this.links[i]);
            const companyInfos = await page.getCompanyInfos();
            this.companyInfos = this.companyInfos.concat(companyInfos);
        }
        return this.companyInfos;
    }

    async loadPage(link){
        const domLoader = new DOMLoader();
        const dom = await domLoader.getDOM(link);
        return dom;
    }

    getLinks(dom){
        const links = select(dom, '.pagination__item');
        let amount = 0;
        
        for(let key in links){
            amount ++;
            const link = links[key];
            let suffix = link.children[0].attribs.href;
            const param = suffix.split("?")[1];
            this.links.push(this.baselink + "?" + param);
        }

        if(amount === 0){
            this.links.push(this.firstLink);
        }        
    }
}

module.exports = PagesList;