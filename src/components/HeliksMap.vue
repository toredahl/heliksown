<template>

  <div id="HeliksMap">
    <div class="left-side">
      <div id="map" v-on:click="clickMap($event)"></div>
    </div>
    <div class="right-side" style="">
      <div id="mapButtons" class="button-row">
        <button id="mark" class="static1 green" @click="handleStreetMarkers()">Besøkte</button>
        <button id="blue-signs" class="static2 darkblue" @click="handleBluePlaques()">Blå skilt</button>
        <!-- <button id="rema-outlets" class="static3 orange" @click="handleRemaOutlets()">REMA</button> -->
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
      <button class="regular"  @click="findMe()" v-if="myposition">Finn meg</button>
      <button class="regular"  @click="simulatePosition()" v-if="mapclicked">Simulate</button>
      <button class="regular"  @click="updateStaticMap()">Static</button>
      <button class="regular"  @click="captureMap()">Capture</button>

      <div id="status" class="status">
        {{position}}
      </div>


      <div id="staticMap" class="status">
        <img v-if="showStatic" :src="staticMapUrl" alt="static map view">
      </div>
      <div id="img-out"></div>
      <div class="visited darkgrey">
        <ul id="been-there" class="decimal">
          <li v-for="item in visitedStreetList" :key="item.id">
            {{ item.adresse }} - {{ item.dato }}   <span class="dot" :style="{ background: item.color }"></span>
          </li>
          <li v-for="item in streetsNotFound" :key="item.id">
            Ikke markert på kart: {{ item }}
          </li>
        </ul>
      </div>
      <div class="blaaskilt darkblue">
        <ul id="blue-signs" class="greek">
          <li v-for="item in bluePlaqueList" :key="item.id">
            {{item.title }} - {{ item.adresse }}  </span>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script>

import L from 'leaflet';
import 'leaflet-routing-machine';
import html2canvas from 'html2canvas';

var mapboxAttribution = '<a href="http://www.kartverket.no/">Kartverket</a>';
var mapboxUrl = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}';
var topographicURL = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}';
var terrainURL = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=terreng_norgeskart&zoom={z}&x={x}&y={y}';
var simpleURL = 'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=egk&zoom={z}&x={x}&y={y}';
var grayscale = L.tileLayer(mapboxUrl, {attribution: mapboxAttribution});
var topographic = L.tileLayer(topographicURL, {attribution: mapboxAttribution});
var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}{r}.png', {  attribution: '© OpenStreetMap contributors'})
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
        bluePlaqueList: [],
        streetMarkers: [],
        routeMarkers: [],
        remaMarkers: [],
        visitedStreetList: [],
        visitedStreetsLayer: null,
        markersAdded: false,
        visitedObj: {},
        bluePlaquesAdded: false,
        remaOutletsAdded: false,
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
        smallIconSize: [16,24],
        waypoints: [],
        mapclicked: false,
        routepossible: false,
        routingControl: null,
        currentPosition: [0,0],
        wpid: null,
        currentMarkerId: null,
        position: '',
        myposition: false,
        positionFound: false,
        staticMapUrl: '',
        showStatic: false
    }
  },
  created: function () {
        this.getBluePlaques();
        this.getAllStreets();
        this.pollPosition();
  },
  mounted() {
      this.initMap();
  },
  watch: {
    currentPosition: function() {
      this.updateCurrentPosition();
    },
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
          "<span style='color: black'>OSM</span>": osm,
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
      simulatePosition: function() {
        if(this.myposition){
          this.currentPosition = this.coordinates;
        }
      },
      updateStaticMap() {
        var lat = this.currentPosition[0];
        var lon = this.currentPosition[1];
        var url = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat +","+ lon + "&zoom=15&size=350x350&markers=color:red%7Clabel:S%7C"+ lat + "," + lon + "&key=AIzaSyCOj9HQAxbaFjpMfTeFg3aiY0l1_egtR30";
        this.staticMapUrl = url;
        this.showStatic = true;
      },
      captureMap() {
        var mapElement = document.querySelector("#staticMap img");
        var imgOut = document.querySelector("#img-out");

        html2canvas(document.getElementById('staticMap'),
        {
          useCORS: true
        }).
        then(function(canvas)
        {
          imgOut.append(canvas);
        });

      },
      clickMap: function(e) {
        // show coordinates when clicking at some point in the map
        var latlng = this.map.mouseEventToLatLng(e);
        this.coordinates = [latlng.lat, latlng.lng];
      },
      pollPosition: function() {
        if ("geolocation" in navigator) {
          self = this;
          var geo_options = {
            enableHighAccuracy: true,
            maximumAge        : 30000,
            timeout           : 25000
          };
          self.wpid = navigator.geolocation.watchPosition(self.success, self.geo_error, self.geo_options);
        }
      },
      updateCurrentPosition: function() {

        if(this.positionFound){
          this.removeMarkers([this.currentMarkerId]);
        }

        this.currentMarkerId = this.addMarker(this.currentPosition, 'min posisjon', 'orange', 'small', 'current' );
        this.positionFound = true;
      },
      getBluePlaques: function() {
          this.axios.get('api/v1/oslogater')
          .then(response => {
            if (response.data) {
              var bluelist = this.blueSigns = response.data.blaaskilt;
              self = this;
              self.bluePlaqueList = [];
              bluelist.forEach(function(value, index ) {
                self.bluePlaqueList.push({'title':value.navn, 'adresse': value.adresse});
              });
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
          this.routeMarkers.push(this.placeMarker(this.coordinates, 'route waypoint','yellow'));
      },
      addMarker: function(coordinates, title, color, size, type ) {
          var mid = this.placeMarker(coordinates, 'din posisjon','orange');
          return mid;
      },
      clearRoute: function() {
        this.waypoints = [];
        if (this.routingControl != null) {
            this.map.removeControl(this.routingControl);
            this.routingControl = null;
        }
      },
      plotRoute: function() {
        var yellow = this.getIcon('yellow');
        var red = this.getIcon('red');
        var marker_icon;
        this.routingControl = L.Routing.control({
          waypoints: this.waypoints,
          createMarker: function (i, start, n){
            if (i == 0) {marker_icon = yellow
            } else if (i == n -1) {marker_icon = red}
            var marker = L.marker (start.latLng, {
               icon: marker_icon
             });
             return marker
          },
          useZoomParameter: true,
          summaryTemplate: '<h2>{name}</h2><h3>{distance}, {time}',
          waypointMode: 'snap',
          lineOptions: {
            styles: [{color: 'green', opacity: 0.5, weight: 7}]
          },
          router: L.Routing.mapbox('pk.eyJ1IjoiaGVsaWtzb3duIiwiYSI6ImNrMWdldXlmeDEzdW8zbW1tcDZ5ODRjcHcifQ.WEeC82uX58mZ1j3KVcxarQ')
        }).addTo(this.map);
        this.routeMarkers = this.removeMarkers(this.routeMarkers);
      },
      findMe: function() {
        if(this.currentPosition[0] != 0){
          this.map.panTo(this.currentPosition);
        }
      },
      placeMarker: function(latlng, title, color, add, type){
        var theMarker = {};
        var icon = this.getIcon(color);
        var options = {
          'title': title,
          'opacity': 1.0,
          'icon': icon
        };
        theMarker = L.marker(latlng, options);
        theMarker.bindPopup(title);
        theMarker.addTo(this.layerGroup);
        return theMarker._leaflet_id;
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
          self.streetMarkers.push(self.placeMarker(latlng, title,value.color));
          self.markersAdded = true;
        });
      }
    },
    template: function(strings, ...keys) {
      return (function(...values) {
        var dict = values[values.length - 1] || {};
        var result = [strings[0]];
        keys.forEach(function(key, i) {
          var value = Number.isInteger(key) ? values[key] : dict[key];
          result.push(value, strings[i + 1]);
        });
      return result.join('');
    });
    },
    handleBluePlaques: function() {
        var self = this;
        if(self.bluePlaquesAdded){
          self.blueMarkers = self.removeMarkers(self.blueMarkers);
          self.bluePlaquesAdded = false;
        }else {
            this.blueSigns.forEach(function(value, index ) {
            try{
              var latlng = [value.lat, value.lon];
              var title = value.navn + ", " + value.adresse;
              self.blueMarkers.push(self.placeMarker(latlng, title,'blue'));
              self.bluePlaquesAdded = true;
            }catch (error){
              var t1Closure = self.template`Feil på : ${0} med feilmelding ${1} `;
            }
          });
        }
      },
      handleRemaOutlets: function() {
          var self = this;
          if(self.RemaAdded){
            self.remaMarkers = self.removeMarkers(self.remaMarkers);
            self.RemaAdded = false;
          }else {
              this.remaOutlets.forEach(function(value, index ) {
          });
          }
      },
      success: function(position) {
        self.currentPosition = [position.coords.latitude, position.coords.longitude];
        var yPos = self.template`Din posisjon (lat,lng): ${0}, ${1} `;
        self.position = yPos(position.coords.latitude, position.coords.longitude);
        self.myposition = true;
      },
      error: function (error) {
        this.position = 'Klarer ikke hente din posisjon ' + error;
      },
      geo_error: function (error) {
          if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(success, error);
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
<style>

  #HeliksMap {
    overflow: auto;
    position: relative;
    display:grid;
    grid-template-columns: 3fr 1fr;
  }

  #HeliksMap h3 {
    font-size: 1rem;
    margin-left: 1rem;
  }

  #HeliksMap .leaflet-routing-alternatives-container, .leaflet-routing-alternatives-container, .heliks-map-route-panel {
    background-color: rgba(256,256,256,0.6);
    padding-left: 0.5rem;
  }

  #HeliksMap .leaflet-routing-alternatives-container h2, .leaflet-routing-alternatives-container h2, .heliks-map-route-panel h2 {
    cursor: pointer;
    font-size: 1.4rem;
  }

  #map {
    height: 67.5vh;
  }

  #img-out {
    margin-left: 1rem;
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

  .decimal {
    list-style-type: decimal;
    margin-left: 0.5rem;
    padding-left: 0;
  }

  .greek {
    list-style-type: lower-greek;
    margin-left: 0.5rem;
    padding-left: 0;
  }

  .left-side, .right-side {
    grid-row: 1;
  }

  @media (max-width: 693px) {
    .left-side, .right-side {
      grid-column-start: none;
    }

    .right-side {
      grid-row: 2;
    }

  }

  .button-row {
    position: absolute;
    top: 0;
    left: 0;
    top: -90px;
    left: 37px;
  }

  .darkblue, .darkblue ul li {
    background-color: rgb(48,50,78);
    color: white;
  }
  .darkgrey {
    background-color: #A9A9A9;
  }

  ul {
    margin-left: 0;
    padding-left: 0.5rem;
  }

  ul li {
    color: black;
    text-transform:uppercase;
  }

  .status {
    padding: .5rem;
    font-size: 11px;
    border:2px solid black;
    margin: 1rem;
  }

  .visited, .blaaskilt {
    padding: 1rem;
    border: 3px solid black;
    font-size: 9px;
    overflow: scroll;
    height: 250px;
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
    top: 100px;
    left: 125px;
    z-index: 1000;
  }

  .static3 {
    position:absolute;
    top: 100px;
    left:238px;
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
    margin: .25rem 0 0.25rem .5rem;
    box-shadow:none;
  }

</style>
