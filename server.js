// server.js
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
app = express();

var axios = require('axios');
var bluePlaqueUrl = 'http://gsx2json.com/api?id=17RCE9ZwQsC8kV6wnRdYAizcxZgbeHKY8WmL7wt_v8aE&sheet=2&columns=false';
var plants = 'http://gsx2json.com/api?id=1rYoxp-qLJDw62Uw1C53cUjr0qxr8-_KUu82oWAgmVr4&sheet=1'
var jservice = 'http://jservice.io/api/clues?value=1000&offset='

// besøkte oslogater
var visitedStreets = 'http://gsx2json.com/api?id=17RCE9ZwQsC8kV6wnRdYAizcxZgbeHKY8WmL7wt_v8aE&sheet=1&columns=false';
//https://docs.google.com/spreadsheets/d/e/2PACX-1vRSrCO7HMGNuot2J78xPMTrfOQWCSW-ZQh4lwGmCaNTbIZ1ymQp-IwS9fCtSrU9AsMvC-eEir0YSt9i/pubhtml
var remaURL = 'http://gsx2json.com/api?id=17RCE9ZwQsC8kV6wnRdYAizcxZgbeHKY8WmL7wt_v8aE&sheet=3&columns=false';

var json_plants;
var limit = 10;
let qcollection = [];
var qlinks = [];
var jquestions;
var q, p;
var streets = [],
    blueplaques = [],
    remaoutlets = [];

const printNow = () => {
  var d = Date();
  a = d.toString();
  return a
}

const getDataAxios = (link) => {
  try {
    return axios.get(link)
  } catch (error) {
    console.error(error)
  }
}

const randomQuestionLinks = () => {
  var d = new Date();
  var rnd = Math.floor(Math.random()*1000);
  var offset =  d.getDate()*100;
  var tot;
  qlinks = [];
  for (i=0;i<limit;i++){
    tot = rnd + offset + i;
    jquestions = jservice + tot.toString();
    qlinks.push(jquestions);
  }
}

const pollQuestionApi = async () => {
  randomQuestionLinks()
  qcollection = [];
  for(l in qlinks){
    var questions = getDataAxios(qlinks[l])
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

const updateQuestions = () => {
  pollQuestionApi()
  app.get('/api/v1/questions', (req, res) => {
    res.status(200).send({
      success: 'true',
      message: 'Spørsmål hentet - SUKSESS ',
      qcollection:  qcollection
    })
  });
}

const countBreeds = async () => {
  const breeds = getDataAxios(plants)
    .then(response => {
      if (response.data) {
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

const countStreets = async () => {
  const breeds = getDataAxios(visitedStreets)
    .then(response => {
      if (response.data) {
        var gater = response.data.rows;
        streets = gater;
      }
    })
    .catch(error => {
      console.log(error)
    })
}

const getBluePlaques = async () => {
  const plaques = getDataAxios(bluePlaqueUrl)
    .then(response => {
      if (response.data) {
        blueplaques = response.data.rows;
      }
    })
    .catch(error => {
      console.log(error)
    })
}

const getRemaOutlets = async () => {
  const plaques = getDataAxios(remaURL)
    .then(response => {
      if (response.data) {
        remaoutlets = response.data.rows;
      }
    })
    .catch(error => {
      console.log(error)
    })
}


const getStreetData = async (url, list) => {
  // attempting refactoring but fails...
  const dataobject = getDataAxios(url)
    .then(response => {
      if (response.data) {
        return response.data.rows;
      }
    })
    .catch(error => {
      console.log(error)
    })

    let result = await dataobject;
    return result
}

const updateStreets = () => {
  countStreets();
  getBluePlaques();
  getRemaOutlets();

  app.get('/api/v1/oslogater', (req, res) => {
    res.status(200).send({
      success: 'true',
      message: 'Bydata hentet - SUKSESS ',
      gater:  streets,
      blaaskilt: blueplaques,
      remabutikker: remaoutlets
    })
  });
}

// first initiate...
updateQuestions()
updatePlants()
updateStreets()
// then set up hourly poll
setInterval(function(){
  console.log("hourly update..." + printNow());
  updatePlants();
  updateQuestions();
}, 3600000);

app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);
