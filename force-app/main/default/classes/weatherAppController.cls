public with sharing class weatherAppController {
    @AuraEnabled(cacheable=true)
    public static String getWeatherDetails(String input, String unit) {
        String url = 'https://api.openweathermap.org/data/2.5/weather?q='+ input + '&units='+ unit + getKey();
        String response = getResponse(url);
        return response;
    }

    public static string getResponse(string strUrl){
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();

        req.setMethod('GET');
        req.setEndpoint(strUrl);
        req.setTimeout(120000);
        res = h.send(req);

        String responseBody = res.getBody();
        return responseBody;
    }

    public static string getKey(){
        string key = System.Label.API_key;
        string output = '&appid=' + key;
        return output;
    }
}