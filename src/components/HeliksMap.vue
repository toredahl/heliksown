<template>

  <div id="HeliksMap">

    <div class="left-side">
      <div id="map" v-on:click="clickMap($event)"></div>
    </div>

    <div class="right-side" style="">

      <div id="mapButtons" class="button-row">
        <button id="mark" class="static1 white" @click="handleStreetMarkers()">Besøkte</button>
        <button id="blue-signs" class="static2 darkblue" @click="handleBluePlaques()">Blå skilt</button>
        <button id="rema-outlets" v-if="RemaReady" class="static3 orange" @click="handleRemaOutlets()">REMA</button>
        <button id="kiwi-outlets"  v-if="KiwiReady" class="static4 green" @click="handleKiwiOutlets()">KIWI</button>
        <button id="joker-outlets"  v-if="JokerReady" class="static5 violet" @click="handleJokerOutlets()">JOKER</button>
        <button id="bunnpris-outlets"  v-if="BunnprisReady" class="static6 yellow" @click="handleBunnprisOutlets()">BUNN</button>
        <button id="coop-outlets"  v-if="CoopReady" class="static7 red" @click="handleCoopOutlets()">COOP</button>
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
        <ul id="blue-signs" class="decimal">
          <li v-for="item in bluePlaqueList" :key="item.id">
            {{item.title }} - {{ item.adresse }}  </span>
          </li>
        </ul>
      </div>

      <div class="remaoutlets darkorange">
        <ul id="rema-butikker" class="hebrew">
          <li v-for="item in remaOutlets" :key="item.id">
            {{item.title }} - {{ item.adresse }}  </span>
          </li>
        </ul>
      </div>

      <div class="kiwioutlets green">
        <ul id="kiwi-butikker" class="latin">
          <li v-for="item in kiwiOutlets" :key="item.id">
            {{item.title }} - {{ item.adresse }}  </span>
          </li>
        </ul>
      </div>

      <div class="jokeroutlets violet">
        <ul id="joker-butikker" class="latin">
          <li v-for="item in jokerOutlets" :key="item.id">
            {{item.title }} - {{ item.adresse }}  </span>
          </li>
        </ul>
      </div>

      <div class="bunnprisoutlets yellow">
        <ul id="bunnpris-butikker" class="latin">
          <li v-for="item in bunnprisOutlets" :key="item.id">
            {{item.title }} - {{ item.adresse }}  </span>
          </li>
        </ul>
      </div>

      <div class="coopoutlets red">
        <ul id="coop-butikker" class="latin">
          <li v-for="item in coopOutlets" :key="item.id">
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
        remaOutlets: [],
        remaObjects: [],
        kiwiMarkers: [],
        kiwiOutlets: [],
        kiwiObjects: [],
        jokerMarkers: [],
        jokerOutlets: [],
        jokerObjects: [],
        bunnprisMarkers: [],
        bunnprisOutlets: [],
        bunnprisObjects: [],
        coopMarkers: [],
        coopOutlets: [],
        coopObjects: [],
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
        remaOutletsParsed: false,
        kiwiOutletsParsed: false,
        jokerOutletsParsed: false,
        bunnprisOutletsParsed: false,
        coopOutletsParsed: false,
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
        showStatic: false,
        RemaAdded: false,
        KiwiAdded: false,
        JokerAdded: false,
        maxAttempts: 0,
        RemaRetrieved: false,
        KiwiRetrieved: false,
        JokerRetrieved: false,
        BunnprisRetrieved: false,
        RemaReady: false,
        KiwiReady: false,
        BunnprisReady: false,
        JokerReady: false,
        CoopReady: false

    }
  },
  created: function () {
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
    BunnprisReady: function() {
      console.log('%c BunnprisReady', 'background-color: yellow; font-size: 20px; color: darkblue;');
    },
    KiwiReady: function() {
      console.log('%c KiwiReady', 'background-color: green; font-size: 20px; color: white;');
    },
    RemaReady: function() {
      console.log('%c RemaReady', 'background-color: darkblue; font-size: 20px; color: white;');
    },
    JokerReady: function() {
      console.log('%c JokerReady', 'background-color: violet; font-size: 20px; color: white;');
    },
    CoopReady: function() {
      console.log('%c CoopReady', 'background-color: red; font-size: 20px; color: white;');
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
          var gatenavn = value.adresse;
          gatenavn = gatenavn.replace(' ','%20');
          var s = this.createQuery(gatenavn);
          var date_visited = value.datobesøkt +'.' + + value.år;
          this.retrieveStreetLatLon(s,value.adresse,date_visited);
        }
      }
      this.streetsParsed = true;
    },
    kiwiOutlets: function() {
      if(!this.kiwiOutletsParsed){
        this.parseAddresses(this.kiwiOutlets, 'kiwi');
      }
      this.kiwiOutletsParsed = true;
    },
    jokerOutlets: function() {
      if(!this.jokerOutletsParsed){
        this.parseAddresses(this.jokerOutlets, 'joker');
      }
      this.jokerOutletsParsed = true;
    },
    remaOutlets: function() {
      if(!this.remaOutletsParsed){
        this.parseAddresses(this.remaOutlets, 'rema');
      }
      this.remaOutletsParsed = true;
    },
    bunnprisOutlets: function() {
      if(!this.bunnprisOutletsParsed){
        this.parseAddresses(this.bunnprisOutlets, 'bunnpris');
      }
      this.bunnprisOutletsParsed = true;
    },
    coopOutlets: function() {
      if(!this.coopOutletsParsed){
        this.parseAddresses(this.coopOutlets, 'coop');
      }
      this.coopOutletsParsed = true;
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

      parseAddresses: function(streets, outlet){
        var count = 0;
        for (let value of streets) {
          var fulladresse = value.adresse;
          var adresse = fulladresse;
          var numberPattern = /\d+/g;
          var nummer = adresse.match(numberPattern);
          var gatenavn = adresse.replace(/\d+\s*/g, "");
          gatenavn = gatenavn.replace('-', '');
          var urlgatenavn = gatenavn;
          var occ = urlgatenavn.split(' ');
          var newstring = '';
          var newstring2 = '';
          if(occ.length>1){
            var t = occ[occ.length-1];
            if(t.length==1){  /* means we have a single letter */
              for(var i=0;i<occ.length-1;i++){
                newstring += occ[i];
                newstring2 += occ[i];
                if(i<occ.length-2){
                  newstring+= '%20';
                  newstring2+= ' ';
                }
              }
              if(newstring.length>2){
                urlgatenavn = newstring;
                gatenavn = newstring2;
              }
            }
          }

          var q = this.createAccurateQuery(urlgatenavn, nummer);
          this.retrieveAddressLatLon(q,gatenavn,nummer, fulladresse, outlet);
        }
      },
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
      /* from the api, we get data for various addresses, and store them client side */
      getAllStreets: function() {
          this.axios.get('api/v1/oslogater')
          .then(response => {
            if (response.data) {
              this.allStreets = response.data.gater;

              if(response.data.blaaskilt){
                var bluelist = this.blueSigns = response.data.blaaskilt;
                self = this;
                self.bluePlaqueList = [];
                bluelist.forEach(function(value, index ) {
                  self.bluePlaqueList.push({'title':value.navn, 'adresse': value.adresse});
                });
              }

              if(response.data.remabutikker){
                var remaoutlets  = response.data.remabutikker;
                remaoutlets.forEach(function(value, index ) {
                  self.remaOutlets.push({'title':value.navn, 'adresse': value.adresse});
                });
              }

              if(response.data.kiwibutikker){
                var kiwioutlets  = response.data.kiwibutikker;
                kiwioutlets.forEach(function(value, index ) {
                  self.kiwiOutlets.push({'title':value.navn, 'adresse': value.adresse});
                });
              }

              if(response.data.jokerbutikker){
                var jokeroutlets  = response.data.jokerbutikker;
                jokeroutlets.forEach(function(value, index ) {
                  self.jokerOutlets.push({'title':value.navn, 'adresse': value.adresse});
                });
              }

              if(response.data.bunnprisbutikker){
                var bunnprisoutlets  = response.data.bunnprisbutikker;
                bunnprisoutlets.forEach(function(value, index ) {
                  self.bunnprisOutlets.push({'title':value.navn, 'adresse': value.adresse});
                });
              }

              if(response.data.coopbutikker){
                var coopoutlets  = response.data.coopbutikker;
                coopoutlets.forEach(function(value, index ) {
                  self.coopOutlets.push({'title':value.navn, 'adresse': value.adresse});
                });
              }

            }
        }).catch(error => {
          console.log("FEILMELDING 3" + error);
        });
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
          language: 'en',
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
      handleKiwiOutlets: function() {
          var self = this;
          if(self.KiwiAdded){
            self.kiwiMarkers = self.removeMarkers(self.kiwiMarkers);
            self.KiwiAdded = false;
          }else {
            self.kiwiObjects.forEach(function(value, index ) {
                try{
                  var latlng = [value.lat, value.lon];
                  var title = name + value.adresse + " " + value.gatenummer
                  self.kiwiMarkers.push(self.placeMarker(latlng, title,'green'));
                }catch (error){
                  var t1Closure = self.template`Feil på : ${0} med feilmelding ${1} `;
                }
              });
              self.KiwiAdded = true;
          }
      },
      handleRemaOutlets: function() {
          var self = this;
          if(self.RemaAdded){
            self.remaMarkers = self.removeMarkers(self.remaMarkers);
            self.RemaAdded = false;
          }else {
              self.remaObjects.forEach(function(value, index ) {
                  try{
                    var latlng = [value.lat, value.lon];
                    var title = "REMA - " + value.adresse + " " + value.gatenummer
                    self.remaMarkers.push(self.placeMarker(latlng, title,'orange'));
                  }catch (error){
                    var t1Closure = self.template`Feil på : ${0} med feilmelding ${1} `;
                  }
                });
                self.RemaAdded = true;
          }
      },
      handleJokerOutlets: function() {
          var self = this;
          if(self.JokerAdded){
            self.jokerMarkers = self.removeMarkers(self.jokerMarkers);
            self.JokerAdded = false;
          }else {
              self.jokerObjects.forEach(function(value, index ) {
                  try{
                    var latlng = [value.lat, value.lon];
                    var title = "JOKER - " + value.adresse + " " + value.gatenummer;
                    self.jokerMarkers.push(self.placeMarker(latlng, title,'violet'));
                  }catch (error){
                    var t1Closure = self.template`Feil på : ${0} med feilmelding ${1} `;
                  }
                });
                self.JokerAdded = true;
          }
      },
      handleBunnprisOutlets: function() {
          var self = this;
          if(self.BunnprisAdded){
            self.bunnprisMarkers = self.removeMarkers(self.bunnprisMarkers);
            self.BunnprisAdded = false;
          }else {
              self.bunnprisObjects.forEach(function(value, index ) {
                  try{
                    var latlng = [value.lat, value.lon];
                    var title = "BUNNPRIS - " + value.title + " - " + value.adresse + " " + value.gatenummer;

                    self.bunnprisMarkers.push(self.placeMarker(latlng, title,'yellow'));
                  }catch (error){
                    var t1Closure = self.template`Feil på : ${0} med feilmelding ${1} `;
                  }
                });
                self.BunnprisAdded = true;
          }
      },
      handleCoopOutlets: function() {
          var self = this;
          if(self.CoopAdded){
            self.coopMarkers = self.removeMarkers(self.coopMarkers);
            self.CoopAdded = false;
          }else {
              self.coopObjects.forEach(function(value, index ) {
                  try{
                    var latlng = [value.lat, value.lon];
                    var title = "COOP - " + value.title + " - " + value.adresse + " " + value.gatenummer;
                    self.coopMarkers.push(self.placeMarker(latlng, title,'red'));
                  }catch (error){
                    var t1Closure = self.template`Feil på : ${0} med feilmelding ${1} `;
                  }
                });
                self.CoopAdded = true;
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
      createAccurateQuery: function(gatenavn, gatenummer){
        var query = 'https://ws.geonorge.no/adresser/v1/sok?adressenavn=' + gatenavn + '&nummer=' + gatenummer + '&kommunenummer=0301';
        var filtrer = '&filtrer=adresser.representasjonspunkt.lat,adresser.representasjonspunkt.lon,adresser.postnummer,adresser.adressenavn,adresser.nummer';
        return query + filtrer;
      },
      retrieveAddressLatLon: function(q, mingate, mittgatenummer, fulladresse, outlet){
        this.axios.get(q)
          .then(response => {
            if (response.data) {
              var streets = JSON.parse(JSON.stringify(response.data,0,2));
              var i = 0;
              var found = false;
              var obj = {};
              for (let value of streets.adresser) {
                i++;
                if(value.adressenavn.toLowerCase().trim() == mingate.toLowerCase().trim()){
                  if(value.nummer == mittgatenummer){
                    obj['adresse'] = value.adressenavn;
                    obj['gatenummer'] = value.nummer;
                    obj['lat'] = value.representasjonspunkt.lat;
                    obj['lon'] = value.representasjonspunkt.lon;
                    obj['postnummer'] = value.postnummer;
                    obj['fulladresse'] = fulladresse;
                    obj['color'] = this.getCityDivisionColor(value.postnummer.substr(0,2));

                    found = true;

                    if(outlet == 'rema'){
                      this.remaObjects.push(obj);
                    }else if(outlet == 'kiwi'){
                      this.kiwiObjects.push(obj);
                    }else if(outlet == 'joker'){
                      this.jokerObjects.push(obj);
                    }else if(outlet == 'bunnpris'){
                      this.bunnprisObjects.push(obj);
                    }else if(outlet == 'coop'){
                      this.coopObjects.push(obj);
                    }else if(outlet == 'heliks'){
                      //this.visitedStreetList.push(obj);
                    }
                    return
                  }
                }else{

                  if(value.adressenavn.substring(1, 4) == mingate.substring(1, 4)){
                    //console.log("UNEQUAL: " + value.adressenavn + ' -->  ' + mingate);
                    //console.log("QUERY: " + q);
                  }
                }
              }
              //console.log("READY WITH " + outlet);
              if(outlet == "kiwi"){
                this.KiwiReady = true;
              }else if(outlet == "rema"){
                this.RemaReady = true;
              }else if(outlet == "bunnpris"){
                this.BunnprisReady = true;
              }else if(outlet == "joker"){
                this.JokerReady = true;
              }else if(outlet == "coop"){
                this.CoopReady = true;
              }

              return obj;
            }
        }).catch(error => {
          console.log("FEILMELDING 1" + error);
        });
    },
    retrieveStreetLatLon: function(q,streetname,date_visited){

      var adresse = streetname.replace('’', '\'');
      var full_date = 'N/A';
      var found = false;
      if(date_visited){
        full_date = date_visited.replace(' ', '');
      }

      var addressList = [];
      var att = 0;
      this.axios.get(q)
        .then(response => {
          if (response.data) {
            var streets = JSON.parse(JSON.stringify(response.data,0,2));

            var i = 0;
            var obj = {};
            for (let value of streets.adresser) {
              i++;
              if(value.adressenavn.toLowerCase() == adresse.toLowerCase() && found == false){
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
              console.log("unable to find match for: " + adresse);
              //console.log(q);
              this.streetsNotFound.push(adresse);
            }
          }
      }).catch(error => {
        this.maxAttempts++;
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

  .decimal, .greek, .hebrew, .latin {
    margin-left: 0.5rem;
    padding-left: 0;
  }

  .decimal {
    list-style-type: decimal;
  }

  .greek {
    list-style-type: lower-greek;
  }

  .hebrew {
    list-style-type: hebrew;
  }

  .latin {
    list-style-type: latin;
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

  .darkgreen {
    background-color: green;
    color: white;
  }

  .darkgrey {
    background-color: #A9A9A9;
    color: white;
  }

  .darkorange {
    background-color: orange;
    color: black;
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

  .visited, .blaaskilt, .remaoutlets, .kiwioutlets, .jokeroutlets, .bunnprisoutlets, .coopoutlets {
    padding: 0.5rem;
    border: 3px solid black;
    font-size: 9px;
    overflow: scroll;
    height: 220px;
    margin: 0.5rem;
  }

  .static1, .static2, .static3, .static4, .static5, .static6, .static7 {
    position:absolute;
    top: 100px;
    z-index: 1000;
  }

  .static1 {
    left:7px;
  }

  .static2 {
    left: 110px;
  }

  .static3 {
    left:220px;
  }

  .static4 {
    left:330px;
  }

  .static5 {
    left: 440px;
  }

  .static6 {
    left: 550px;
  }

  .static7 {
    left: 660px;
  }

  .red {
    background-color: red;
    color: white;
  }

  .white {
    background-color: white;
    color: red;
  }
  .green {
    background-color: green;
    color: white;
  }

  .violet {
    background-color: violet;
    color: white;
  }

  .orange {
    background-color: orange;
    color: white;
  }

  .yellow {
    background-color:yellow;
    color: darkblue;
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
