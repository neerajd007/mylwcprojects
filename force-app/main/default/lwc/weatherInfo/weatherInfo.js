import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import WeatherInfoIcons from '@salesforce/resourceUrl/WeatherInfoIcons'
import getWeatherDetails from '@salesforce/apex/weatherAppController.getWeatherDetails'

export default class WeatherInfo extends LightningElement {
    cityName='New Delhi';
    units
    loadingTxt='';
    isError=false;
    response = {
        "temperature" : "",
        "description" : "",
        "location" : "",
        "feels_like" : "",
        "humidity" : "",
        "pressure" : "",
        "temp_min" : "",
        "temp_max" : "",
        "speed" :  "" 
    }
    weatherIcon
    
    tempUnit="C";

    searchIcon = WeatherInfoIcons+ '/WeatherInfoIcons/magnifying-glass-solid.svg'
    tempIcon = WeatherInfoIcons+ '/WeatherInfoIcons/temperature-full-solid.svg'
    humidIcon = WeatherInfoIcons+ '/WeatherInfoIcons/droplet-solid.svg'
    gaugeIcon = WeatherInfoIcons+ '/WeatherInfoIcons/gauge-high-solid.svg'
    windIcon = WeatherInfoIcons+ '/WeatherInfoIcons/wind-solid.svg'

    currentDateTime;
    date_time_cure=''
    get loadingClasses(){
        return this.isError ? 'error-msg':'success-msg';
    }
    
    connectedCallback(){
        this.units="metric"
        this.cityName='New Delhi'
        this.fetchdata(this.units);   
    }

    changeHandler(event){     
        this.cityName = event.target.value;
        console.log(this.cityName);
               
    }

    submitHandler(event){
        event.preventDefault();
        //this.units = "metric"
        this.fetchdata(this.units);       
        event.target.reset();
    }

    /*
    get loadingClasses(){
        return this.isError ? 'error-msg':'success-msg';
    }

    searchHandler(event){
        this.cityName = event.target.value;
    }
 
    submitHandler(event){
        event.preventDefault();
        this.fetchdata();   
    }
    */
    fetchdata(unit){
        this.isError=false;
        this.loadingTxt = 'Fetching weather details...';
        console.log(this.cityName);
        
        //server side calling
        getWeatherDetails({input:this.cityName, unit:this.units}).then(result=>{
            this.weatherDetails(JSON.parse(result));
        }).catch((error)=>{
            this.response=null;
            this.loadingTxt = 'Something went wrong'
            this.isError=true;
            console.log(error)
        })
    }
        

    weatherDetails(info){
        if(info.cod==="404"){
            this.isError=true;
            this.loadingTxt=`${this.cityName} isn't a valid city name.`
        }else{
            this.loadingTxt =''
            this.isError=false;
            const city= info.name
            const country = this.convertCountryCode(info.sys.country)
            const {description, id} = info.weather[0]
            const {temp, feels_like, humidity,temp_min, temp_max, pressure} = info.main
            const speed = info.wind.speed;
            

            this.weatherIcon = `https://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`



            this.response = {
                city: city,
                temperature: Math.floor(temp),
                description: description,
                location: `${city}, ${country}`,
                feels_like: Math.floor(feels_like),
                humidity: `${humidity}%`,
                pressure: `${pressure}`,
                temp_min: `${temp_min}`,
                temp_max: `${temp_max}`,
                speed: `${speed}`,
            }
               
            
        }
    }

    convertCountryCode(country){
        let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
        return regionNames.of(country)
    }

    async unitCHandler(event){
        this.tempUnit = ""
        this.units = 'metric'
        this.fetchdata(this.units);
        this.tempUnit = "C"
        
    }

    async unitFHandler(event){
        this.tempUnit = ""
        this.units = 'imperial'
        await this.fetchdata(this.units);
        this.tempUnit = "F"
    }

    

}

