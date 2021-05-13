<template>
  <div>
    <v-text-field v-model="position" placeholder="adresse"></v-text-field>

    <!-- <v-text-field
      v-model= "esp"
          
            placeholder="adresse d'un esp"
          ></v-text-field> -->

    <v-btn :disabled="!valid" color="success" class="mr-4" @click="loca">
      Valider
    </v-btn>
    

    <div class="map">
      <l-map
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
        style="height: 80%; z-index: 1"
        @update:center="centerUpdate"
        @update:zoom="zoomUpdate"
      >
        <l-tile-layer :url="url" :attribution="attribution" />

        <l-marker
          v-for="item in markers"
            :key="item.id"
            :lat-lng="item.position"
        >
        <l-popup>
            <v-list>
              <v-list-item>
                <v-list-item-title> Bienvenue à/chez : </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Température : </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Pression : </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Ensoleillement :</v-list-item-title>
              </v-list-item>
            </v-list>
          </l-popup>
        </l-marker>
        <l-marker :lat-lng="marker1">  
          <l-popup>
            <v-list>
              <v-list-item>
                <v-list-item-title> Température : </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Pression : </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Ensoleillement :</v-list-item-title>
              </v-list-item>
            </v-list>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
    <v-card class="card">
      
      <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{city}}
        </v-list-item-title>
        <v-list-item-subtitle>{{"Latitude: "+latitude+" / Longitude: "+longitude}}</v-list-item-subtitle> <!-- Mettre la date-->
      </v-list-item-content>
    </v-list-item>

<v-card-text>
      <v-row align="center">
        <v-col
          class="display-3"
          cols="6"
        >
           {{ temperature }} &deg;C
        </v-col>
        <v-col cols="6">
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/sun.png"
            alt="Sunny image"
            width="92"
          ></v-img>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-send</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{wind}}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-cloud-download</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{humidity}}</v-list-item-subtitle>
    </v-list-item>


            <v-list class="transparent">
      <v-list-item
        v-for="item in forecast"
        :key="item.day"
      >
        <v-list-item-title>{{ item.type }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right" >
          {{ item.value }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    </v-card>
  </div>
</template>






<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker,LPopup } from "vue2-leaflet";

export default {
  name: "Pmap",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },

  data() {
    return {
      api_key: "d0f74ba55214c45401d7ae1941791222",
      url_base: "https://api.openweathermap.org/data/2.5/",
      esp: "",
      position: "",
      zoom: 13,
      today: new Date(),
      wind:"--",
      city:"--",
      temperature:"--",
      humidity:"--",
      latitude:"--",
      longitude:"--",
      weather: {},
      dataEsp: {},
      marker1: latLng(43.7101728, 7.2619532),
       markers: [
        {
          id: "m1",
          position: { lat: 51.505, lng: -0.09 },
        },
        {
          id: "m2",
          position: { lat: 51.8905, lng: -0.09 },
        },
        {
          id: "m3",
          position: { lat: 51.005, lng: -0.09 },     
        },
        {
          id: "m4",
          position: { lat: 50.7605, lng: -0.09 },
        }
      ],
      forecast: [
          { type: 'Temperature ressentie', icon: 'mdi-thermometer', value:"--"},
          { type: 'Pression', icon: 'mdi-arrow-split-horizontal', value: '--' },
        
        ],

      valid: true,
      center: latLng(43.7101728, 7.2619532),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',

      currentZoom: 11.5,

      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },

  mounted() {
    this.dataEspFetcher();
  },

  methods: {
    dataEspFetcher: async function () {
      await fetch("http://localhost:3000/meteo").then((res) => {
        res.json().then((body) => {
          console.log(body);
          this.dataEsp = body;
        });
      });
    },
    fetchApiWeather: async function () {
      await fetch(
        `${this.url_base}weather?q=${this.position}&units=metric&APPID=${this.api_key}`
      ).then((res) => {
        res.json().then((body) => {
          console.log(body);
          this.weather = body;
          this.temperature = this.weather.main.temp;
          this.city = this.weather.name;
          this.latitude = this.weather.coord.lat;
          this.longitude = this.weather.coord.lon;
          this.forecast[0].value = this.weather.main.feels_like +" \xB0";
          this.humidity = this.weather.main.humidity +" %";
          this.wind = this.weather.wind.speed +" km";
          if(this.weather.weather[0].main == "Clouds"){
            this.forecast[0].icon = "mdi-cloud";
          }


          this.forecast[1].value = this.weather.main.pressure+" Pa";



          this.forecast[2].value = this.weather.coord.lat;
        });
      });
    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },

    loca: async function () {
      var adr = this.position;

      adr.replaceAll(" ", "%20");
      adr.replaceAll(",", "%2C");

      const key = "pk.2a042f7fb2119042d73b548892eac47e";
      var url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${this.position}&limit=1&accept-language=fr&countrycodes=fr&format=json`;
      fetch(url)
        .then((response) => response.json())
        .then((res) => {
          this.center = latLng(parseFloat(res[0].lat), parseFloat(res[0].lon));
        });

      this.show = true;
      this.fetchApiWeather();
    },
  },
};
</script>
<style>
.map {
  width: 50%;
  height: 600px;
  position:relative;
  left: 50%;
}
.card{
  width: 50%;
}
</style>