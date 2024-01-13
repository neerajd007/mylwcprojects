import { LightningElement } from 'lwc';
import weatherAppIcons from '@salesforce/resourceUrl/weatherAppIcons'
import getWeatherDetails from '@salesforce/apex/weatherAppController.getWeatherDetails'

//const API_KEY = '0ca206f4e8653919b5f2f04545a13a46';

export default class WeatherApp extends LightningElement {

    // clearIcon = weatherAppIcons+'/weatherAppIcons/clear.svg'
    // cloudIcon = weatherAppIcons+'/weatherAppIcons/cloud.svg'
    // dropletIcon = weatherAppIcons+'/weatherAppIcons/droplet.svg'
    // hazeIcon = weatherAppIcons+'/weatherAppIcons/haze.svg'
    // mapIcon = weatherAppIcons+'/weatherAppIcons/map.svg'
    // rainIcon = weatherAppIcons+'/weatherAppIcons/rain.svg'
    // snowIcon = weatherAppIcons+'/weatherAppIcons/snow.svg'
    // stormIcon = weatherAppIcons+'/weatherAppIcons/storm.svg'
    // thermoemeterIcon = weatherAppIcons+'/weatherAppIcons/thermometer.svg'
    // arrowBackIcon = weatherAppIcons+'/weatherAppIcons/arrow-back.svg'

    cityName='';
    loadingTxt='';
    isError=false;
    response
    weatherIcon
    tmpF=0

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

    fetchdata(){
        this.isError=false;
        this.loadingTxt = 'Fetching weather details...';
        console.log(this.cityName);
        
        //server side calling
        getWeatherDetails({input:this.cityName}).then(result=>{
            this.weatherDetails(JSON.parse(result));
        }).catch((error)=>{
            this.response=null;
            this.loadingTxt = 'Something went wrong'
            this.isError=true;
            console.log(error)
        })
        


        // const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&appid=${API_KEY}`
        
        // fetch(URL).then(res=>res.json()).then(result=>{
        //     console.log(JSON.stringify(result))
        //     this.weatherDetails(result);
        // }).catch((error)=>{
        //     console.log(error)
        //     console.log("something went wrong")
        //     this.loadingTxt = 'Something went wrong'
        //     this.isError=true;
        // })
    }

    weatherDetails(info){
        if(info.cod==="404"){
            this.isError=true;
            this.loadingTxt=`${this.cityName} isn't a valid city name.`
        }else{
            this.loadingTxt =''
            this.isError=false;
            const city= info.name
            const country = info.sys.country
            const {description, id} = info.weather[0]
            const {temp, feels_like, humidity} = info.main

            this.weatherIcon = `https://openweathermap.org/img/wn/${info.weather[0].icon}@4x.png`

            // if(id===800){
            //     this.weatherIcon = this.clearIcon;
            // } else if((id>=200 && id <=232) || (id>=500 && id<=522)){
            //     this.weatherDetails = this.stormIcon
            // } else if(id>=701 && id <=781){
            //     this.weatherIcon = this.hazeIcon
            // }else if(id>=801 && id<=804){
            //     this.weatherIcon = this.cloudIcon
            // }else if((id>=500 && id<=531) || (id>=300 && id<=321) ){
            //     this.weatherIcon = this.rainIcon
            // } else{}


            this.response = {
                city: city,
                temperature: Math.floor(temp),
                description: description,
                location: `${city}, ${country}`,
                feels_like: Math.floor(feels_like),
                humidity: `${humidity}%`,
            }

            this.tmpF = (1.8*Math.floor(temp))+32;
            
        }
    }

    backHandler(){
        this.response = null
        this.cityName=''
        this.loadingTxt=''
        this.isError=false
        this.weatherIcon=''
    }
}