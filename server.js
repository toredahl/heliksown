// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();

var axios = require('axios');
var bluePlaqueUrl = 'http://gsx2json.com/api?id=17RCE9ZwQsC8kV6wnRdYAizcxZgbeHKY8WmL7wt_v8aE&sheet=2&columns=false';
var plants = 'http://gsx2json.com/api?id=1rYoxp-qLJDw62Uw1C53cUjr0qxr8-_KUu82oWAgmVr4&sheet=1'
var jservice = 'http://jservice.io/api/clues?value=1000&offset='
//https://docs.google.com/spreadsheets/d/e/2PACX-1vRSrCO7HMGNuot2J78xPMTrfOQWCSW-ZQh4lwGmCaNTbIZ1ymQp-IwS9fCtSrU9AsMvC-eEir0YSt9i/pubhtml

var json_plants;
var d = new Date();
var rnd = Math.floor(Math.random()*1000);
var offset =  d.getDate()*100;
var limit = 10;
let qcollection = [];
var qlinks = [];
var jquestions;
var q, p;

var tot;
for (i=0;i<limit;i++){
  tot = rnd + offset + i;
  jquestions = jservice + tot.toString();
  qlinks.push(jquestions);
}

const getQuestions = (link) => {
  try {
    return axios.get(link)
  } catch (error) {
    console.error(error)
  }
}

const pollQuestionApi = async () => {

  for(l in qlinks){
    var questions = getQuestions(qlinks[l])
      .then(response => {
        if (response.data) {
            var arr = response.data;
            arr.forEach(function(element) {
                qcollection.push(element);
            });
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
}

pollQuestionApi()

const getBreeds = () => {
  try {
    return axios.get(plants)
  } catch (error) {
    console.error(error)
  }
}

const countBreeds = async () => {
  const breeds = getBreeds()
    .then(response => {
      if (response.data) {
        console.log(
          "Hentet async data"
        )
        json_plants = Object.entries(response.data.rows);
      }
    })
    .catch(error => {
      console.log(error)
    })
}

const updatePlants = () => {
  countBreeds()
  app.get('/api/v1/plants', (req, res) => {
    res.status(200).send({
      success: 'true',
      message: 'Plantebase hentet - SUKSESS ',
      plants:  json_plants
    })
  });
}

// first initiate plant retrieval...
console.log("updating plants...");
updatePlants()
// then set up hourly poll
setTimeout(function(){
  console.log("attempting hourly update...");
  updatePlants()
}, 3600000);

app.get('/api/v1/questions', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Spørsmål hentet - SUKSESS ',
    qcollection:  qcollection
  })
});

app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);
