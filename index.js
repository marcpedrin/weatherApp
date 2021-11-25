require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333
const request = require('request');

//view engine

app.set('view engine', 'ejs')

//urlencoded

app.use(express.urlencoded({extended: false}))

//routess

app.get('/',(req,res)=>{
    res.render('index', {data: null, error: null})
})

app.post('/',(req,res)=>{
    let city = req.body.city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=37d99f4c8bd8fa96d4509c54c8a262d7`
    request(url, (err,resposne,body)=>{
        if(err){
            res.render('index', {data: null, error: "Error please try again"});
        }

        else{
            let data = JSON.parse(body);
            // console.log(data)
            if (data.main == undefined){
                res.render('index', {data: null, error: "Error please try again"});
            }
            else{
                let place = `${data.name}, ${data.sys.country == "IN"?"India" : data.sys.country == "US"?"United States of America": data.sys.country == "GB"?"United Kingdom":data.sys.country}`
                let temp = `${((data.main.temp) - 273.15).toFixed(1)}`
                let description = `${data.weather[0].description}`
                let sunrise = `${new Date(data.sys.sunrise*1000)}`

                res.render('index', {
                    data: data,
                    place: place,
                    temp: temp,
                    description: description,
                    sunrise: sunrise,
                    error: null
                })
            }
        }
    })
})

//port

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})