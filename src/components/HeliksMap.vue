<template>

  <div id="HeliksMap">
    <div class="left-side">
      <div id="map" v-on:click="clickMap($event)"></div>
    </div>
    <div class="right-side" style="">
      <div id="mapButtons" class="button-row">
        <button id="mark" class="static1 green" @click="handleStreetMarkers()">Besøkte</button>
        <button id="blue-signs" class="static2 darkblue" @click="handleBluePlaques()">Blå skilt</button>
      </div>
      <h3>Klikk på kart for å se koordinater</h3>
      <div id="coords" class="status">
        Siste koordinat: {{coordinates}}
        <hr>
        Rute: {{waypoints}}
      </div>
      <button class="regular" @click="addPoint()" v-if="mapclicked">Legg til punkt</button>
      <button class="regular" @click="plotRoute()" v-if="routepossible">Vis rute</button>
      <button class="regular"  @click="clearRoute()" v-if="routepossible">Fjern</button>
      <div id="status" class="status">
        {{visited}}
      </div>
      <div class="visited">
        <ul id="been-there">
          <li v-for="item in visitedStreetList" :key="item.id">
            {{ item.adresse }} - {{ item.dato }}   <span class="dot" :style="{ background: item.color }"></span>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>

import L from 'leaflet';
import 'leaflet-routing-machine';
//import 'lrm-here';

var mapboxAttribution = '<a href="http://www.kartverket.no/">Kartverket</a>';
var mapboxUrl = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}';
var topographicURL = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}';
var terrainURL = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=terreng_norgeskart&zoom={z}&x={x}&y={y}';
var simpleURL = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=egk&zoom={z}&x={x}&y={y}';
var grayscale = L.tileLayer(mapboxUrl, {attribution: mapboxAttribution});
var topographic = L.tileLayer(topographicURL, {attribution: mapboxAttribution});
var terrain = L.tileLayer(terrainURL, {attribution: mapboxAttribution});
var simple = L.tileLayer(simpleURL, {attribution: mapboxAttribution});

export default {
  name: 'HeliksMap',
  data () {
    return {
        blueSigns: [],
        myIcon: null,
        layerGroup: null,
        allStreets: [],
        visitedStreets: [],
        blueMarkers: [],
        streetMarkers: [],
        visitedStreetList: [],
        visitedStreetsLayer: null,
        markersAdded: false,
        visitedObj: {},
        bluePlaquesAdded: false,
        visited: 0,
        magicNumber: 0,
        comparison: 0,
        showlist: false,
        streetsLookedUp: false,
        streetsNotFound: [],
        streetsParsed: false,
        map: '',
        coordinates: [],
        iconSize: [20,35],
        waypoints: [],
        mapclicked: false,
        routepossible: false,
        routingControl: null
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
    // when we have all the streets, we filter out those visited and keep them
    allStreets: function() {
      this.filterVisitedStreets();
    },
    visitedStreets: function() {
      // we have the updated list, now need to query the street names for coordinates
      if(!this.streetsParsed ){
        var count = 0;
        var streets = this.visitedStreets;
        for (let value of streets) {
          var s = this.createQuery(value.adresse);
          var date_visited = value.datobesøkt +'.' + + value.år;
          this.retrieveStreetLatLon(s,value.adresse,date_visited);
        }
      }
      this.streetsParsed = true;
    },
    coordinates: function() {
      this.mapclicked = true;
    },
    waypoints: function() {
        if(this.waypoints.length > 1){
          this.routepossible = true;
        }else {
          this.routepossible = false;
        }
    }
  },
  methods:  {
      initMap: function() {

        var baseMaps = {
        	"<span style='color: gray'>Grayscale</span>": grayscale,
        	"<span style='color: black'>Topographic</span>": topographic,
          "<span style='color: darkgreen'>Terrain</span>": terrain,
          "<span style='color: darkblue'>Simple</span>": simple
        };

        this.map = L.map('map', {
          center: [59.9245246,10.7617007],
          zoom: 14,
          layers: [grayscale]
        });

        L.control.layers(baseMaps).addTo(this.map);
        this.layerGroup = L.layerGroup().addTo(this.map);
      },
      clickMap: function(e) {
        // show coordinates when clicking at some point in the map
        var latlng = this.map.mouseEventToLatLng(e);
        this.coordinates = [latlng.lat, latlng.lng];
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
          this.magicNumber = self.visitedStreets.length;
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
      getIcon: function(color){
        return new L.Icon({
          iconUrl: this.coloredIcon(color),
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [20,35],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [35,35]
        });
      },
      addPoint: function() {
          this.waypoints.push(this.coordinates);
      },
      clearRoute: function() {
        this.waypoints = [];
        if (this.routingControl != null) {
            this.map.removeControl(this.routingControl);
            this.routingControl = null;
        }
      },
      plotRoute: function() {

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        var wayPoint1 = L.latLng(59.93222811929446, 10.746143419323314);
        var wayPoint2 = L.latLng(59.92319770615971, 10.76061845015068);

        var rWP1 = new L.Routing.Waypoint;
        rWP1.latLng = wayPoint1;

        var rWP2 = new L.Routing.Waypoint;
        rWP2.latLng = wayPoint2;

        var green = new L.Icon({
          iconUrl: this.coloredIcon('green'),
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [this.iconSize],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [35,35]
        });

        var red = new L.Icon({
          iconUrl: this.coloredIcon('red'),
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [this.iconSize],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [35,35]
        });

        var marker_icon;

        this.routingControl = L.Routing.control({
          waypoints: this.waypoints,
          createMarker: function (i, start, n){
            if (i == 0) {
                // This is the first marker, indicating start
                marker_icon = green
            } else if (i == n -1) {
                //This is the last marker indicating destination
                marker_icon = red
            }

            var marker = L.marker (start.latLng, {
               icon: marker_icon
             })
             return marker

          },
          useZoomParameter: true,
          showAlternatives: false,
          containerClassName: 'route-panel',
          summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}',
          waypointMode: 'snap',
          router: L.Routing.mapbox('pk.eyJ1IjoiaGVsaWtzb3duIiwiYSI6ImNrMWdldXlmeDEzdW8zbW1tcDZ5ODRjcHcifQ.WEeC82uX58mZ1j3KVcxarQ')
        }).addTo(this.map);

        //this.map.fitBounds(L.latLngBounds(this.waypoints));

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
          iconSize: [iconSize],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [35,35]
        });

        var options = {
          'title': title,
          'opacity': 1.0,
          'icon': icon
        };

        theMarker = L.marker(latlng, options);
        theMarker.bindPopup(title);
        theMarker.addTo(this.layerGroup);

        if(type == 'bluemarker'){
          this.blueMarkers.push(theMarker._leaflet_id);
        }else {
            this.streetMarkers.push(theMarker._leaflet_id);
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
          self.layerGroup.removeLayer(value);
        });
        markerlist = [];
        return markerlist;
      },
      handleStreetMarkers: function() {
        var self = this;
        if(self.markersAdded){
          self.streetMarkers = self.removeMarkers(self.streetMarkers);
          self.markersAdded = false;
        }else {
          this.visitedStreetList.forEach(function(value, index ) {
          var latlng = [value.lat, value.lon];
          var title = value.dato + " - " + value.adresse;
          self.placeMarker(latlng, title,value.color,'normal',false, 'streetmarker');
          self.markersAdded = true;
        });
      }
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
      },
      createQuery: function(streetname){
        var query = 'https://ws.geonorge.no/adresser/v1/sok?adressenavn=' + streetname + '&kommunenummer=0301';
        var filtrer = '&filtrer=adresser.representasjonspunkt.lat,adresser.representasjonspunkt.lon,adresser.postnummer,adresser.adressenavn';
        return query + filtrer;
      },
      retrieveStreetLatLon: function(q,streetname,date_visited){
        var mingate = streetname.replace('’', '\'');
        var full_date = date_visited.replace(' ', '');

        this.axios.get(q)
          .then(response => {
            if (response.data) {
              //var s = this.plotData(response.data,streetname,date_visited);
              var streets = JSON.parse(JSON.stringify(response.data,0,2));

              var i = 0;
              var found = false;
              for (let value of streets.adresser) {
                i++;
                if(value.adressenavn.toLowerCase() == mingate.toLowerCase()){
                  var obj = {};
                  obj['adresse'] = value.adressenavn;
                  obj['dato'] = full_date;
                  obj['lat'] = value.representasjonspunkt.lat;
                  obj['lon'] = value.representasjonspunkt.lon;
                  obj['postnummer'] = value.postnummer;
                  obj['color'] = this.getCityDivisionColor(value.postnummer.substr(0,2));
                  this.visitedStreetList.push(obj);
                  found = true;
                  return
                }
              }
              if(!found){
                console.log("unable to find match for: " + mingate);
                this.streetsNotFound.push(mingate);
              }
            }
        });
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
    grid-template-columns: 3fr 1fr;
  }

  #HeliksMap h3 {
    font-size: 1rem;
    padding-left: 0.5rem;
  }

  #map {
    height: 67.5vh;
  }

  .route-panel {
    background: white;
    opacity: 0.5;
  }

  .route-panel h2 {
    font-size: 18px;
  }

  .route-panel h3 {
    font-size: 16px;
  }

  .dot {
    height: 5px;
    width: 5px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    margin-left: 1rem;
}


  .left-side {
    /* grid-column: col-start -1 / span 11; */
    grid-row: 1;

  }

  .right-side {
    /* grid-column: col-start 10 / span 3; */
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

  /* .right {
    float:right;
    width: 20%;
  }

  .left {
    float:left;
    width: 80%;
    overflow: scroll;
  } */

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

  .regular {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border-radius: 10px;
    border: 1px solid grey;
    min-width: 100px;
    margin: .25rem 0 0.25rem 1rem;
  }

</style>
