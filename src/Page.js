const HtmlParser = require('htmlparser2');
const select = require('soupselect').select;
const CompanyInfo = require('./CompanyInfo');
const DOMLoader = require('./DOMLoader');

class Page{
  constructor(url){
    this.url =  url;
    this.companyInfos = [];
    this.companyCSVData = [];
    this.numberOfCompanies = 0;
    this.companyInfosGathered = 0;
  }

  async getCompanyInfos(){
    const domLoader = new DOMLoader();
    const dom = await domLoader.getDOM(this.url);
    await this.parseMainPage(dom);
    return this.companyInfos;
  }

  async parseMainPage( dom ){
    const collection = select(dom, 'table.table--single-md .link');
    // debug purposes
    let amount = 0;
    for( let key in collection ) {
       if(amount ++ > 2){
           continue;
       }
      const company = collection[key];
      this.numberOfCompanies ++;
      const href = company.attribs.href;
      if(!href){
        // some links are broken
        continue;
      }
      const companyInfo = new CompanyInfo(href);
      await companyInfo.load();
      this.companyInfos.push(companyInfo);
    }
  }
}

module.exports = Page;