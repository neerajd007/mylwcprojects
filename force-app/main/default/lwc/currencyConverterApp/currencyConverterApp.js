import { LightningElement } from 'lwc';
import { countryCodeList } from 'c/countryCodeList';
import currencyConverterAssets from '@salesforce/resourceUrl/currencyConverterAssets'

export default class CurrencyConverterApp extends LightningElement {

    currencyImage = currencyConverterAssets+'/currencyConverterAssets/currency.svg'

    countryList = countryCodeList;

    countryFrom = "USD";
    countryTo = "INR";
    result
    error
    amount=''
    exchangeRate=''
    handleChange(event){
        const {name, value} = event.target;
        console.log("name", name)
        console.log("value", value)
        this[name] = value;
        this.result='';
        this.error='';
        this.exchangeRate=''
    }

    submitHandler(event){
        event.preventDefault() //to restrict the reload behavior when submit button is pressed.
        this.convert();
    }

    async convert(){
        const API_KEY = '5c0493250cffac9125c3b17c';
        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${this.countryFrom}/${this.countryTo}`

        try{
            const data = await fetch(API_URL);
            const jsonData = await data.json();
            this.result = (Number(this.amount) * jsonData.conversion_rate).toFixed(2);
            this.exchangeRate = Number(jsonData.conversion_rate).toFixed(2);
            console.log(jsonData);
            console.log(this.result);
        }catch(error){
            this.error = "An error occured! Pleasee try again."
            console.log(error)
        }

    }

}