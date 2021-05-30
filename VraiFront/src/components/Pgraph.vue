<template>
  <div class="small"><h2 v-if="prenom">Esp de l'utilisateur: {{ nom }} {{ prenom }}</h2>

    <h4 v-if="!aJour" style="color: orange"> Donnees pas a jour</h4>
    <h4 v-if="aJour" style="color: green"> Donnees a jour</h4>
    <h3>
      <v-icon large>mdi-image-filter-hdr</v-icon>
      Altitude : {{ this.valEsp[this.valEsp.length - 1].altitude }} m
    </h3>
    <div class="dataEsp">
      <line-chart :chart-data="datacollection" id="graph"></line-chart>
      <div class="liStyle" v-if="etatValiditeData">

        lumiere: {{ etatValiditeData.lumiere }}
        temperature: {{ etatValiditeData.temperature }}
        pression: {{ etatValiditeData.pression }}
        humidity: {{ etatValiditeData.humidity }}

      </div>
    </div>
    <v-app-bar color="rgba(0,0,0,0)" flat class="ma-8">
      <v-icon large>mdi-chart-bell-curve-cumulative</v-icon>
      <h3>Valeur</h3>
      <v-chip-group
          v-model="selection"
          active-class="teal accent-4 white--text"
          class="ma-1"
          mandatory
      >
        <v-chip @click="dataType('lumiere')">Lumière</v-chip>

        <v-chip @click="dataType('pression')">Pression</v-chip>

        <v-chip @click="dataType('humidite')">Humidité</v-chip>

        <v-chip @click="dataType('temperature')">Température</v-chip>

        <v-chip><input v-model="nbValeur">Nb de Val</v-chip>
      </v-chip-group>
    </v-app-bar>
  </div>
</template>

<script>
import {Line} from "vue-chartjs";
import LineChart from "./LineChart.js";

export default {
  extends: Line,
  components: {
    LineChart,
  },
  data() {
    return {
      aJour: undefined,
      etatValiditeData: undefined,
      datacollection: null,
      prenom: undefined,
      nom: undefined,
      selection: 0,
      nbValeur: undefined, //A changer pour changer le nb de valeur du graph
      typeDataActuel: undefined
    };
  },
  props: {
    valEsp: {},
  },
  mounted() {
    if (this.valEsp) {
      console.log(this.valEsp)
      this.dataType("lumiere");
      this.getName();
      this.validationData();
      if (this.valEsp.length < 50) {
        this.nbValeur = 10;
      }
      else{
        this.nbValeur = 50;
      }
    }
    console.log(this.valEsp);
  },
  methods: {
    //permet d'actualiser le Graph en fonction du type de data
    //les ypes de data possible: lumiere, pression, humidite, temperature
    dataType(typeData) {
      //permet de définir quel est le type de données en fonction du label
      let labelData = typeData === 'lumiere' ? 'Lumière en Lumens' : typeData === 'pression' ?
          'Pression en Pascal' : typeData === 'humidite' ? 'Humidité en %' : 'Température en °C';
      //défini le type de data en cours d'utilisation
      this.typeDataActuel = typeData;
      this.datacollection = {
        labels: this.getDate(),
        datasets: [
          {
            label: labelData,
            data: this.splitListData(typeData),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      };
    },
    //permet de prendre les données correspondantes au label donné par dataType(labelData);
    splitListData(typeData) {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index][typeData]);
      }
      return res;
    },

    getDate() {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index].date);
      }
      return res;
    },

    getName() {
      fetch(`http://localhost:3000/user/name/${this.valEsp[this.valEsp.length - 1].userId}`).then((res) =>
          res.json().then((e) => {
            console.log('user: ', e);
            this.prenom = e.userFirstName;
            this.nom = e.userLastName;
          })
      );
    },

    validationData() {

      fetch("http://localhost:3000/meteo/verif", {
        method: "post",
        body: JSON.stringify(this.valEsp[this.valEsp.length - 1]),
        headers: {"Content-Type": "application/json"},
      }).then((res) => {
        try {
          res.json().then((data) => {
            console.log(data)
            this.etatValiditeData = data;
            this.aJour = true;

          });
          //
        } catch (err) {
          this.aJour = false;
          console.log('erreur')
        }

      });
    }
  },
  //permet de regarder la valeur d'une data dans le composant
  //https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property
  watch: {
    nbValeur: function () {
      this.dataType(this.typeDataActuel);
    },
    valEsp: function (val) {
      if (val) {
        console.log(val)
        this.dataType("lumiere");
        this.getName();
        this.validationData();
      }

      console.log(val);
    }
  }
};
</script>

<style>
#graph {
  width: 60%;
}

h2 {
  color: #4299E1;
}

.dataEsp {
  display: flex;


}

.liStyle {

  margin-top: 50px;
  margin-left: 50px;
}
</style>
