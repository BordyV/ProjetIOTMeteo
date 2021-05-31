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

        <table>
          <thead>
          <th>Type</th>
          <th>Fiabilité</th>
          </thead>
          <tbody>
          <tr v-for="(value, name) in etatValiditeData" :key="name">
            <td>
              {{ name }}
            </td>
            <td v-if="value">
              <v-icon style="color: green">mdi-check-circle-outline</v-icon>
            </td>
            <td v-if="!value">
              <v-icon style="color: red">mdi-alert-circle-outline</v-icon>
            </td>
          </tr>
          </tbody>
        </table>

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
import urlApi from './ConfApi.js';

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
      typeDataActuel: undefined,


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
      } else {
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
          'Pression en hectoPascal' : typeData === 'humidite' ? 'Humidité en %' : 'Température en °C';
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
        //on divise la valeur recue par 100 pour la pression car on recoit les valeurs sous forme de Pascal tandis que la norme et l'hectoPascal
        if (typeData === "pression") {
          res.push((this.valEsp[index][typeData]) / 100);
        } else {
          res.push(this.valEsp[index][typeData]);
        }
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
      fetch(`${urlApi}/user/name/${this.valEsp[this.valEsp.length - 1].userId}`).then((res) =>
          res.json().then((e) => {
            console.log('user: ', e);
            this.prenom = e.userFirstName;
            this.nom = e.userLastName;
          })
      );
    },

    validationData() {
      console.log('validation')
      fetch(urlApi + "/meteo/verif", {
        method: "post",
        body: JSON.stringify(this.valEsp[this.valEsp.length - 1]),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      }).then((res) => {
        try {
          res.json().then((data) => {
            console.log(data)
            this.etatValiditeData = data;
            this.aJour = true;
            console.log(this.etatValiditeData.temperature, "test1");
            console.log(this.etatValiditeData.pression, "test2");
            console.log(this.etatValiditeData.humidity, "test3");


          });
          //
        } catch (err) {
          this.aJour = false;
          console.log('erreur')
        }

      });
    },
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
th, td {
  border-bottom: 1px solid #ddd;
  padding: 15px;
  text-align: left;
}

tr:hover {
  background-color: #f5f5f5;
}

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
