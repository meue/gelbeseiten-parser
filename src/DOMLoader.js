const request = require('request');
const HtmlParser = require('htmlparser2');
const c2w = require("cli-to-web");

class DOMLoader{
    async getDOM(url){
        this.url = url;
        this.dom = null;
        this.onDomLoaded = null;
        const self = this;
        const callDonePromise = new Promise(function (resolve, reject) {
            self.onDomLoaded = resolve;
        });
        setTimeout(
            () => this.start(url),
            DOMLoader.ANTI_DDOS_DELAY * Math.random()
        );
        
        await callDonePromise;
        return this.dom;
    }

    start(url){
        request.get( url , (err, response, body) => this.httpsHandler(err, body, url) )
    }

    httpsHandler(err, body, url) {
        if(err){
          console.error('found broken link, probably their problem, not ours: ' + url);
          c2w.error('Unbrauchbarer Link gefunden. Vermutlich liegt das Problem aber nicht bei uns: ' + url);
          process.exit(1);
        }
  
        const htmlParser = new HtmlParser.DefaultHandler( (error, dom) => this.parseCallback(error, dom));
        const parser = new HtmlParser.Parser(htmlParser);
        parser.parseComplete(body);
    }

    parseCallback(error, dom){
        if (error){
          console.log( 'error', error );
          c2w.error('Fehler: <br/>' + error);
          process.exit(1);
        }
        this.dom = dom;
        this.onDomLoaded();
    }
}

DOMLoader.ANTI_DDOS_DELAY = 100; // We dont want to kill the server. Lets wait between 1ms and 100ms until next request

module.exports = DOMLoader;
