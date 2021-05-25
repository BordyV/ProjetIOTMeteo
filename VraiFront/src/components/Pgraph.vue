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
        <v-chip @click="dataLum()">Lumière</v-chip>

        <v-chip @click="dataPres()">Pression</v-chip>

        <v-chip @click="dataHumi()">Humidité</v-chip>

        <v-chip @click="dataTemp()">Température</v-chip>

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
    };
  },
  props: {
    valEsp: {},
  },
  mounted() {
    this.dataLum();
    console.log(this.valEsp);
  },
  methods: {
    dataLum() {
      this.datacollection = {
        labels: this.getDate(),
        datasets: [
          {
            label: "Lumière",
            data: this.splitListLum(),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      };
    },
    splitListLum() {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index].lumiere);
      }
      return res;
    },

    dataPres() {
      this.datacollection = {
        labels: this.getDate(),
        datasets: [
          {
            label: "Pression",
            data: this.splitListPres(),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      };
    },
    splitListPres() {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index].pression);
      }
      return res;
    },

    dataHumi() {
      this.datacollection = {
        labels: this.getDate(),
        datasets: [
          {
            label: "Humidité",
            data: this.splitListHumi(),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      };
    },

    splitListHumi() {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index].humidite);
      }
      return res;
    },

    dataTemp() {
      this.datacollection = {
        labels: this.getDate(),
        datasets: [
          {
            label: "Température",
            data: this.splitListTemp(),
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)",
          },
        ],
      };
    },

    splitListTemp() {
      let res = [];
      let i = this.valEsp.length - this.nbValeur;
      let imax = this.valEsp.length;
      for (let index = i; index < imax; index++) {
        res.push(this.valEsp[index].temperature);
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
};
</script>