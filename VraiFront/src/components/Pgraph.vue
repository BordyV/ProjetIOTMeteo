<template>
  <div class="small">
    <v-icon large>mdi-image-filter-hdr </v-icon>
    <h3>Altitude : {{ this.valEsp[this.valEsp.length - 1].altitude }} m</h3>
    <line-chart :chart-data="datacollection" id="graph"></line-chart>
    <v-app-bar color="rgba(0,0,0,0)" flat class="ma-8">
      <v-icon large>mdi-chart-bell-curve-cumulative </v-icon>
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
import { Line } from "vue-chartjs";
import LineChart from "./LineChart.js";

export default {
  extends: Line,
  components: {
    LineChart,
  },
  data() {
    return {
      datacollection: null,
      selection: 0,
      nbValeur: 50, //A changer pour changer le nb de valeur du graph
      typeDataActuel : undefined
    };
  },
  props: {
    valEsp: {},
  },
  mounted() {
    if(this.valEsp){
      this.dataType("lumiere");
    }

    console.log(this.valEsp);
  },
  methods: {
    //permet d'actualiser le Graph en fonction du type de data
    //les ypes de data possible: lumiere, pression, humidite, temperature
    dataType(typeData) {
      //permet de définir quel est le type de données en fonction du label
      let labelData = typeData == 'lumiere' ? 'Lumière en Lumens': typeData == 'pression' ?
       'Pression en Pascal': typeData == 'humidite' ? 'Humidité en %': 'Température en °C';
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
  },
  //permet de regarder la valeur d'une data dans le composant
  //https://vuejs.org/v2/guide/computed.html#Computed-vs-Watched-Property
  watch: {
    nbValeur: function () {
     this.dataType(this.typeDataActuel);
    }
  }
};
</script>

<style>
 #graph{
   width: 60%;
 }
</style>
