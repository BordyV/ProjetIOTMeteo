<template>
  <div class="small">
    <v-icon large>mdi-image-filter-hdr </v-icon>
    <h3>Altitude : {{ this.valEsp[this.valEsp.length - 1].altitude }}</h3>
    <line-chart :chart-data="datacollection"></line-chart>
    <v-app-bar color="rgba(0,0,0,0)" flat class="ma-8">
      <v-icon large>mdi-chart-bell-curve-cumulative </v-icon>
      <h3>Valeur</h3>
      <v-chip-group
        v-model="selection"
        active-class="teal accent-4 white--text"
        class="ma-8"
        mandatory
      >
        <v-chip @click="dataType('Lumière')">Lumière</v-chip>

        <v-chip @click="dataType('Pression')">Pression</v-chip>

        <v-chip @click="dataType('Humidité')">Humidité</v-chip>

        <v-chip @click="dataType('Température')">Température</v-chip>

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
      labelDataActuel : undefined
    };
  },
  props: {
    valEsp: {},
  },
  mounted() {
    this.dataType("Lumière");
    console.log(this.valEsp);
  },
  methods: {
    //permet d'actualiser le Graph en fonction du label de data
    //les labels de data possible: Lumière, Pression, Humidité, Température 
    dataType(labelData) {
      //défini le label en cours d'utilisation
      this.labelDataActuel = labelData;
      //permet de définir quel est le type de données en fonction du label 
      let typeData = labelData == 'Lumière' ? 'lumiere': labelData == 'Pression' ?
       'pression': labelData == 'Humidité' ? 'humidite': 'temperature';  
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
     this.dataType(this.labelDataActuel);
    }
  }
};
</script>