import { LightningElement,api } from 'lwc';

export default class AppendHtml extends LightningElement {

    _result;
    isLoaded

    @api
    get result(){
        return this._result;
    }

    set result(data){
        this._result=data
        if(this.isLoaded){
            this.attachHtml();
        }
    }

    renderedCallback(){
        if(this._result && !this.isLoaded){
            this.attachHtml();
        }
    }

    attachHtml(){
        const container = this.template.querySelector('.htmlcontainer');
        if(container){
            container.innerHTML = this.result;
            this.isLoaded=true;
        }
    }

}