<template>

  <div id="HeliksMap">
    <div class="left-side">
      <div id="map"></div>
    </div>
    <div class="right-side" style="">
      <div id="mapButtons" class="button-row">
        <button id="markers" class="static1 green" @click="handleVisitedStreets()">Besøkte</button>
        <button id="blue-signs" class="static2 darkblue" @click="handleBluePlaques()">Blå skilt</button>
      </div>

      <div id="coords" class="status">

      </div>
      <div id="status" class="status">
        {{visited}}
      </div>
      <div class="visited">
        <ul id="been-there">
          <li v-for="item in visitedAdresses" :key="item.id">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>

import L from 'leaflet';


var mapboxAttribution = '<a href="http://www.kartverket.no/">Kartverket</a>';
var mapboxUrl = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}';
var grayscale = L.tileLayer(mapboxUrl, {attribution: mapboxAttribution});

export default {
  name: 'HeliksMap',
  data () {
    return {
        blueSigns: [],
        myIcon: null,
        layerGroup: null,
        allStreets: [],
        visitedStreets: [],
        streetsVisited: [],
        blueMarkers: [],
        visitedStreetsLayer: null,
        markersAdded: false,
        visitedObj: {},
        bluePlaquesAdded: false,
        visited: 0,
        showlist: false
    }
  },
  created: function () {
        this.getBluePlaques();
        this.getAllStreets();
  },
  mounted() {
      this.initMap();
  },
  watch: {
    allStreets: function() {
      this.filterVisitedStreets();
    }
  },
  methods:  {
      initMap: function() {
        var map = L.map('map', {
          center: [59.9245246,10.7617007],
          zoom: 14,
          layers: [grayscale]
        });
        this.layerGroup = L.layerGroup().addTo(map);
      },
      getBluePlaques: function() {
          this.axios.get('api/v1/oslogater')
          .then(response => {
            if (response.data) {
              this.blueSigns = response.data.blaaskilt;
            }
          })
      },
      getAllStreets: function() {
          this.axios.get('api/v1/oslogater')
          .then(response => {
            if (response.data) {
              this.allStreets = response.data.gater;
            }
          })
      },
      filterVisitedStreets: function() {
          var streets = this.allStreets;
          self = this;
          streets.forEach(function(value, index ) {
            if(value.datobesøkt != 0){
              self.visitedStreets.push(value);
            }
          });
      },
      customIcon: function() {
         this.myIcon = L.icon({
          iconUrl: 'my-icon.png',
          iconSize: [25, 25],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowUrl: 'my-icon-shadow.png',
          shadowSize: [38, 55],
          shadowAnchor: [22, 94]
        });
      },
      coloredIcon: function(color){
        var newIcon = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-' + color + '.png';
        return newIcon;
      },
      placeMarker: function(latlng, title, color, size, add, type){
        var iconSize;
        var theMarker = {};

        if(size=='normal'){
          iconSize = [20,35]
        }else if(size=='small'){
          iconSize = [16,24]
        }else{
          iconSize = [26,42]
        }

        var icon = new L.Icon({
          iconUrl: this.coloredIcon(color),
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: iconSize,
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [35,35]
        });

        var options = {
          'title': title,
          'opacity': 1.0,
          'icon': icon
        };

        theMarker = L.marker(latlng, options);//.addTo(map).bindPopup(title);
        theMarker.bindPopup(title);
        theMarker.addTo(this.layerGroup);
        if(type == 'bluemarker'){
          this.blueMarkers.push(theMarker._leaflet_id);
        }else {
          this.visitedStreets.push(theMarker._leaflet_id);
        }

      },
      getCityDivisionColor: function(muni){
        switch (muni) {
          case '01':return 'orange';break;
          case '02':return 'green';break;
          case '03':return 'violet';break;
          case '04':return 'yellow';break;
          case '05': return 'red';break;
          case '06': return 'grey';break;
          case '07': return 'black';break;
          default:return 'grey';
        }
      },
      removeMarkers: function(markerlist) {
        var self = this;
        markerlist.forEach(function(value, index ) {
          //console.log(value);
          self.layerGroup.removeLayer(value);
        });
        markerlist = [];
        return markerlist;
      },
      plotData: function(d,streetname,date_visited){

        var streets = JSON.parse(JSON.stringify(d,0,2));
        if(streets.adresser.length > 0 ){
          var latlng = [streets.adresser[0].representasjonspunkt.lat,streets.adresser[0].representasjonspunkt.lon];
          if(streets.adresser[0].adressenavn.toLowerCase() == streetname.toLowerCase()){
            var color = this.getCityDivisionColor(streets.adresser[0].postnummer.substr(0,2));
            this.placeMarker(latlng, streetname + " - " + date_visited, color, 'normal', true);
            //this.placeMarker(latlng, streetname + " - " + date_visited.replace(/\s/g, ""), color, 'normal', true);
          }else{
            console.log("no match: " + streets.adresser[0].adressenavn.toLowerCase() + " is unequal to " + streetname.toLowerCase() );
          }
          var streetCoords = [];
          var addresses = streets.adresser;
          addresses.forEach(function(value, index){
            if(value.adressenavn.toLowerCase() == streetname.toLowerCase() ){
              var coords = [value.representasjonspunkt.lat, value.representasjonspunkt.lon];
              streetCoords.push(coords);
            }
          });
          var t = JSON.stringify(streetCoords, 2,null);
          return t;
        }
      },
      createQuery: function(streetname){
        var query = 'https://ws.geonorge.no/adresser/v1/sok?adressenavn=' + streetname + '&kommunenummer=0301';
        var filtrer = '&filtrer=adresser.representasjonspunkt.lat,adresser.representasjonspunkt.lon,adresser.postnummer,adresser.adressenavn';
        return query + filtrer;
      },
      retrieveStreetCoords: function(q,streetname,date_visited){

        this.axios.get(q)
          .then(response => {
            if (response.data) {
              var s = this.plotData(response.data,streetname,date_visited);
              this.visitedObj[streetname] = s;
            }
          })
      },
      handleVisitedStreets: function() {

          var counter = 0;
        self = this;
        if(!self.markersAdded){
          var streets = self.visitedStreets;
          streets.forEach(function(value, index ) {
            counter++;
            var s = self.createQuery(value.adresse);
            var date_visited = value.datobesøkt + value.år;
            // should add the coordinates first retrival, so no further polls
            self.retrieveStreetCoords(s,value.adresse,date_visited);
          });

          self.populateVisitedList();
          self.markersAdded = true;
          self.visited = counter;
        }else{
          self.visited = 0;
          //console.log(self.visitedStreets);
          self.removeMarkers(self.visitedStreets);
          self.markersAdded = false;
        }
      },
      populateVisitedList: function() {
        console.log("finished markers");
      },
      handleBluePlaques: function() {
        var self = this;
        if(self.bluePlaquesAdded){
          self.blueMarkers = self.removeMarkers(self.blueMarkers);
          self.bluePlaquesAdded = false;
        }else {
          this.blueSigns.forEach(function(value, index ) {
            var latlng = [value.lat, value.lon];
            var title = value.navn + ", " + value.adresse;
            self.placeMarker(latlng, title,'blue','normal',false, 'bluemarker');
            self.bluePlaquesAdded = true;
        });
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #HeliksMap {
    overflow: auto;
    position: relative;
    display:grid;
  }

  #map {
    /* width: 900px;
    height: 800px; */
    height: 67.5vh;
  }

  .left-side {
    grid-column: col-start -1 / span 11;
    grid-row: 1;

  }

  .right-side {
    grid-column: col-start 10 / span 3;
    grid-row: 1;
  }

  .button-row {
    position: absolute;
    top: 0;
    left: 0;
  }

  .darkblue {
    background-color: rgb(48,50,78);
    color: white;
  }

  ul {
    margin-left: 0;
    padding-left: 0.5rem;
  }

  ul li {
    color: black;
    text-transform:uppercase;
  }

  .right {
    float:right;
    width: 20%;
  }

  .left {
    float:left;
    width: 80%;
    overflow: scroll;
  }

  .status {
    padding: 1.25rem;
    font-size: 11px;
    border:2px solid black;
    margin: 1rem;
  }

  .visited {
    padding: 1rem;
    border: 3px solid black;
    background-color: #A9A9A9;
    font-size: 9px;
    overflow: scroll;
    height: 400px;
    margin: 1rem;
  }

  .static1 {
    position:absolute;
    top: 100px;
    left:17px;
    z-index: 1000;
  }

  .static2 {
    position:absolute;
    top: 150px;
    left:17px;
    z-index: 1000;
  }

  .static3 {
    position:absolute;
    top: 200px;
    left:17px;
    z-index: 1000;
  }

  .static4 {
    position:absolute;
    top: 250px;
    left:17px;
    z-index: 1000;
  }

  .green {
    background-color: green;
    color: white;
  }

  .orange {
    background-color: orange;
    color: white;
  }

  .red {
    background-color:red;
    color: white;
  }

  button {
    -webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
      padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border-radius: 10px;
    border:1px solid white;
    min-width: 100px;
  }

  .yellowIcon {
    color: red;
    background-color:yellow;
  }


</style>
