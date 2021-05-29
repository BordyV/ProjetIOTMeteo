<template>
  <div class="page">
    <spinner :showSpinner="showSpinner"></spinner>
    <div class="section1">
      <v-flex class="saisir" style="color: white">
        Veuillez saisir votre ville :
      </v-flex>
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
            <l-tile-layer :url="url" :attribution="attribution" />

            <l-marker
              v-for="item in listMarkersESP"
              :key="item.id"
              :lat-lng="item.position"
              @click="dataEspFetcherbyId(item.id)"
            >
              <l-popup>
                <v-dialog v-model="dialog" width="1000">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="#191970"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      :disabled="dataEsp == null"
                    >
                      Voir Détails
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="headline grey lighten-2">
                      Graphiques de votre recherche
                    </v-card-title>

                    <v-card-text>
                      <Pgraph v-bind:valEsp="dataEsp" class="pgraph"></Pgraph>
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
              <l-icon
                :icon-size="dynamicSize"
                :icon-anchor="dynamicAnchor"
                :icon-url="iconOpenWeatherRed"
              />
            </l-marker>
          </l-map>
        </div>
      </v-col>
      <v-col>
        <Pstat v-bind:weatherbis="weather" class="pstat"></Pstat>
      </v-col>
    </v-row>
    <v-snackbar absolute top v-model="snackbarErrorCity">
      Ville Inconnue
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbarErrorCity = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!--<bootstrap-dropdown(:options="options" @select="selected = $event" ) name="input-name">  -->
  </div>
</template>


<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "vue2-leaflet";
import Pgraph from "./Pgraph.vue";
import Pstat from "./Pstat.vue";
import Spinner from "./Spinner.vue";

export default {
  name: "Pmap",

  components: {
    LMap,
    LTileLayer,
    LIcon,
    LMarker,
    LPopup,
    Pgraph,
    Pstat,
    Spinner,
  },

  data() {
    return {
      esp: "",
      position: "",
      zoom: 13,
      weather: undefined,
      dataEsp: undefined,
      dialog: false,
      showSpinner: false,
      markerOpenWeather: null,
      iconOpenWeatherRed: null,
      listMarkersESP: [],
      snackbarErrorCity: false,
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
    this.iconOpenWeatherRed = require("@/assets/marker-icon-red.png");
    this.getInfoEsp();
  },
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    },
  },
  methods: {
    dataEspFetcherbyId: async function (mac) {
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      console.log("ESP ID: ", mac);
      await fetch(`http://localhost:3000/meteo/freshData/${mac}`)
        .then((res) => {
          res.json().then((body) => {
            this.dataEsp = body;
            console.log(body);
            //on cache le spinner une fois qu'on a les données
            this.showSpinner = false;
          });
        })
        .catch((err) => {
          console.error(err);
          //on set les data de l'esp qu'on veut recup a null pour désactiver le bouton si aucune données trouvés
          this.dataEsp = null;
          //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
          this.showSpinner = false;
        });
    },

    fetchApiWeather: async function () {
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      await fetch(
        "http://localhost:3000/meteo/openWeatherMeteo/" + this.position
      )
        .then((res) => {
          console.log("prout", res);
          res.json().then((body) => {
            if (body.cod === "404") {
              this.snackbarErrorCity = true;
              //on cache le spinner avant de sortir
              this.showSpinner = false;
              //permet de quitter la fonction prématurement et ne pas continuer et initialiser weather
              return;
            }
            console.log(body);

            this.weather = body;
            //On ajoute a markerOpenWeather la longitude et la latitude de la position exacte de la station météo
            this.markerOpenWeather = latLng(
              this.weather.coord.lat,
              this.weather.coord.lon
            );
            this.center = latLng(
              this.weather.coord.lat,
              this.weather.coord.lon
            );
            //on cache le spinner une fois qu'on a les données ( obligé de le faire une seconde fois car on sort prématurement avec la 404)
            this.showSpinner = false;
          });
        })
        .catch((err) => {
          console.error(err);
          //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
          this.showSpinner = false;
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
      //on affiche le spinner qui sert de loader
      this.showSpinner = true;
      fetch("http://localhost:3000/esp/")
        .then((response) => {
          response.json().then((res) => {
            console.log(res);

            res.forEach((e) => {
              this.listMarkersESP.push({
                id: e.adresseMac,
                position: e.adresse,
              });
              //on cache le spinner une fois qu'on a les données
              this.showSpinner = false;
            });
          });
        })
        .catch((err) => {
          console.error(err);
          //on cache le spinner si on arrive pas àa récupèrer les données pour ne pas géner l'utilisateur
          this.showSpinner = false;
        });
    },
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
  top: 15%;
  /* display: block; */

  left: 48%;
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
  background-color: white;
}
body{
  background-color: #191970;
}
</style>
