const Catalog = require("./Catalog");
const CompanyInfo = require("./CompanyInfo");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const c2w = require("cli-to-web");

class Main{
    constructor(){
        const baseLinks = [
            "https://www.gelbeseiten.de/branchenbuch/staedte/Brandenburg/Kreisfrei/Potsdam/unternehmen/",
            "https://www.gelbeseiten.de/branchenbuch/staedte/Sachsen/Kreisfrei/Dresden/unternehmen/",
            "https://www.gelbeseiten.de/branchenbuch/staedte/Sachsen/G%C3%B6rlitz/G%C3%B6rlitz/unternehmen/",
            "https://www.gelbeseiten.de/branchenbuch/staedte/Brandenburg/Kreisfrei/Frankfurt%20Oder/unternehmen/",
            "https://www.gelbeseiten.de/branchenbuch/staedte/Th%C3%BCringen/Kreisfrei/Gera/unternehmen/",
            "https://www.gelbeseiten.de/branchenbuch/staedte/berlin/berlin/Berlin/unternehmen/"
        ];
        
        this.catalog = new Catalog();
        for(let i=0; i<baseLinks.length ;i++){
            this.catalog.addBaseLink(baseLinks[i]);
        }

        c2w.show();
        console.log("Showing progress in web browser: http://localhost:3000");
        c2w.tell("Starte Vorgang mit " + baseLinks.length + " Städten.");
        this.loadWebData();
    }

    async loadWebData(){
        /** @type {Array.<CompanyInfo>} */
        const companyInfos = await this.catalog.loadAllCompanyInfos();
        c2w.tell("Es wurden " + companyInfos.length + " Firmen gefunden");
        this.parseCompanyInfo(companyInfos);
    }

    parseCompanyInfo(companyInfos){
        c2w.tell("Daten werden in CSV exportiert");
        const companyCsvData = [];
        for(let i=0; i< companyInfos.length; i++){
            /** @type {CompanyInfo} */const companyInfo = companyInfos[i];
            companyCsvData.push(companyInfo.getObject());
        }
        this.writeToCsv(companyCsvData)
    }

    writeToCsv(companyCsvData){
        const filename = 'companies_' + Math.floor((Math.random() * 10000))
        const csvWriter = createCsvWriter({
        path: filename + '.csv',
        header: [
            {id: 'name', title: 'Name'},
            {id: 'link', title: 'Referenz'},
            {id: 'street', title: 'Adresse'},
            {id: 'plz', title: 'PLZ'},
            {id: 'phone', title: 'Telefon'},
        ]
        });
    
        csvWriter
        .writeRecords(companyCsvData)
        .then(() => this.allDone(filename));
    }

    allDone(filename){
        c2w.tell("Datei geschrieben unter " + filename + ". Viel Spaß :)");
        c2w.finish();
        exit(0);
    }
}

new Main();

// async function testSingle(){
//     const testCompany = new CompanyInfo("https://www.gelbeseiten.de/gsbiz/0a688913-38a1-47d5-b590-732ca943b656");
//     testCompany.load();
// }
// testSingle();

