<template>
  <div>
    <div class="section1">
      <v-flex class="saisir"> Veuillez saisir votre adresse : </v-flex>
      <v-text-field
        v-model="position"
        placeholder="Exemple : (Nice, 2 Avenue sainte-claire, ...)"
        class="champ"
      ></v-text-field>

      <!-- <v-text-field
      v-model= "esp"
          
            placeholder="adresse d'un esp"
          ></v-text-field> -->

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="loca">
        Valider
      </v-btn>
    </div>
    <v-row>
      <v-col class="col1">
        <div class="map">
          <l-map
            :zoom="zoom"
            :center="center"
            :options="mapOptions"
            style="height: 60%; width: 50%; z-index: 1"
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
          </l-map>
        </div>
      </v-col>
      <v-col>
        <Pstat v-bind:weatherbis="weather" class="pstat"></Pstat>
      </v-col>
      <v-col>
        <v-card>
          <Pgraph
            v-if="dataEsp"
            v-bind:valEsp="dataEsp"
            class="pgraph"
          ></Pgraph>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>






<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import Pgraph from "./Pgraph.vue";
import Pstat from "./Pstat.vue";

export default {
  name: "Pmap",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    Pgraph,
    Pstat,
  },

  data() {
    return {
      api_key: "d0f74ba55214c45401d7ae1941791222",
      url_base: "https://api.openweathermap.org/data/2.5/",
      esp: "",
      position: "",
      zoom: 13,
      weather: undefined,
      dataEsp: undefined,
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
        },
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
          //console.log(body);
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
  width: 100%;
  height: 600px;
}
.saisir {
  margin-top: 20px;
  margin-bottom: 20px;
}
.champ {
  width: 40%;
}

.col1 {
  position: absolute;
  top: 80px;
  /* display: block; */

  left: 700px;
  /* bottom: 10px; */
}
.pgraph {
  width: 70%;
  height: 70%;
  margin-top: 15%;
}
</style>