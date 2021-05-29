<template>
  <div class="page">
    <div class="section1">
      <v-flex class="saisir" style="color: white">
        Veuillez saisir votre ville :
      </v-flex>
      <span v-if="errorApi" style="color: red"> Ville Inconnue</span>
      <v-text-field
          v-model="position"
          placeholder="Exemple : (Nice, Paris, Guingamp ...)"
          label="Votre ville"
          filled
          rounded
          dense
          class="champ"
          :append-icon="(marker = 'mdi-magnify')"
          @click:append="loca"
      >
      </v-text-field>


      <!-- <v-text-field
      v-model= "esp"

            placeholder="adresse d'un esp"
          ></v-text-field> -->
    </div>
    <v-row>
      <v-col class="col1">
        <div class="map">
          <l-map
              :zoom="zoom"
              :center="center"
              :options="mapOptions"
              style="height: 100%; width: 50%; z-index: 1"
              @update:center="centerUpdate"
              @update:zoom="zoomUpdate"
          >
            <l-tile-layer :url="url" :attribution="attribution"/>

            <l-marker
                v-for="item in listMarkersESP"
                :key="item.id"
                :lat-lng="item.position"
                @click="dataEspFetcherbyId(item.id)"
            >
              <l-popup>

                <v-dialog v-model="dialog" width="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="#191970" dark v-bind="attrs" v-on="on">
                      Voir Détails
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline grey lighten-2">
                      Graphiques de votre recherche
                    </v-card-title>

                    <v-card-text>
                      <Pgraph
                          v-bind:valEsp="dataEsp"
                          class="pgraph"
                      ></Pgraph>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialog = false">
                        Retour
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </l-popup>
            </l-marker>
            <l-marker v-if="weather" :lat-lng="markerOpenWeather">

            </l-marker>
          </l-map>
        </div>
      </v-col>
      <v-col>
        <Pstat v-bind:weatherbis="weather" class="pstat"></Pstat>
      </v-col>

    </v-row>
    <!--<bootstrap-dropdown(:options="options" @select="selected = $event" ) name="input-name">  -->
  </div>
</template>


<script>
import {latLng} from "leaflet";
import {LMap, LTileLayer, LMarker, LPopup} from "vue2-leaflet";
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
      errorApi :false,
      esp: "",
      position: "",
      zoom: 13,
      weather: undefined,
      dataEsp: undefined,
      dialog: false,
      markerOpenWeather: null,
      listMarkersESP: [],

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
    this.getInfoEsp();
  },

  methods: {
    dataEspFetcherbyId: async function (mac) {
      console.log('ESP ID: ',mac);
      await fetch(`http://localhost:3000/meteo/freshData/${mac}`).then((res) => {
        res.json().then((body) => {
          this.dataEsp = body;
          console.log(body);
        });
      });
    },

    fetchApiWeather: async function () {
      await fetch("http://localhost:3000/meteo/openWeatherMeteo/"+ this.position)
      .then((res) => {
        console.log("prout", res)
        res.json().then((body) => {
          if (body.cod === "404") {
            this.errorApi = true;
          }
          console.log(body);

          this.weather = body;
          //On ajoute a markerOpenWeather la longitude et la latitude de la position exacte de la station météo
          this.markerOpenWeather = latLng(this.weather.coord.lat, this.weather.coord.lon);
          this.center = latLng(this.weather.coord.lat, this.weather.coord.lon);
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
      this.show = true;
      this.fetchApiWeather();
    },


    getInfoEsp() {

      fetch("http://localhost:3000/esp/").then((response) => response.json())
          .then((res) => {
            console.log(res)

            res.forEach((e) => {

              this.listMarkersESP.push({id: e.adresseMac, position: e.adresse});
            })
          });
    }
  },
};
</script>
<style>
.section1 {
  margin-left: 20px;
}

.title {
  text-align: center;
}

.map {
  width: 100%;
  height: 500px;
}

.saisir {
  margin-top: 20px;
  margin-bottom: 20px;
}

.champ {
  width: 39%;
}

.col1 {
  position: absolute;
  top: 80px;
  /* display: block; */

  left: 700px;
  /* bottom: 10px; */
}

.pgraph {
  position: relative;
  width: 100%;
  height: 70%;
}

.dialog {
  position: relative;
  top: 400px;
  right: 250px;
  height: 20%;
}

.pstat {
  margin-left: 40px;
  margin-top: 30px;
}

.mr-4 {
  margin-left: 20px;
}

.page {
  background-color: #4299e1;
  /*width: 120%;*/
}

.v-input__slot {
  margin-left: 20px;
}

</style>
