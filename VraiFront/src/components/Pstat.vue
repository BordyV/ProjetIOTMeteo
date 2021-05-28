<template>
  <v-card class="card">
    <v-list-item two-line >
      <v-list-item-content>
        <v-list-item-title class="headline">
          {{ city }}
        </v-list-item-title>
        <v-list-item-subtitle>{{
          "Latitude: " + latitude + " / Longitude: " + longitude
        }}</v-list-item-subtitle>
        <!-- Mettre la date-->
      </v-list-item-content>
    </v-list-item>

    <v-card-text >
      <v-row align="center">
        <v-col class="display-3" cols="6"> {{ temperature }} &deg;C </v-col>
        <v-col cols="6">
          <v-icon class="icon"> {{ tempicon }}</v-icon>
        </v-col>
      </v-row>
    </v-card-text>

    <v-list-item >
      <v-list-item-icon>
        <v-icon>mdi-weather-windy</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{ wind }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item >
      <v-list-item-icon>
        <v-icon>mdi-cloud-download</v-icon>
      </v-list-item-icon>
      <v-list-item-subtitle>{{ humidity }}</v-list-item-subtitle>
    </v-list-item>

    <v-list class="transparent" >
      <v-list-item v-for="item in forecast" :key="item.day" >
        <v-list-item-title>{{ item.type }}</v-list-item-title>

        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-subtitle class="text-right">
          {{ item.value }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    weatherbis: {},

  },
  data() {
    return {
      today: new Date(),
      wind: "--",
      city: "--",
      temperature: "--",
      humidity: "--",
      latitude: "--",
      longitude: "--",
      tempicon: "",
      forecast: [
        { type: "Temperature ressentie", icon: "mdi-thermometer", value: "--" },
        { type: "Pression", icon: "mdi-arrow-split-horizontal", value: "--" },
      ],
    };
  },
  mounted() {
    this.setup();
  },
  watch: {
      weatherbis: function(){
        this.setup();
      }
    },
  methods: {
    setup() {
      console.log("coucou");
      console.log(this.weatherbis);
      this.weather = this.weatherbis;
      this.temperature = this.weather.main.temp;
      this.city = this.weather.name;
      this.latitude = this.weather.coord.lat;
      this.longitude = this.weather.coord.lon;
      this.forecast[0].value = this.weather.main.feels_like + " \xB0";
      this.humidity = this.weather.main.humidity + " %";
      this.wind = this.weather.wind.speed + " km";

      if (this.weather.weather[0].main === "Clouds") {
        this.tempicon = "mdi-cloud";

      } else if (this.weather.weather[0].main === "Sunny") {
        this.tempicon = "mdi-white-balance-sunny";
      } else if (this.weather.weather[0].main === "Rain") {
        this.tempicon = "mdi-weather-pouring";
      } else if (this.weather.weather[0].main === "Snow") {
        this.tempicon = "mdi-snowflake";
      } else if (this.weather.weather[0].main === "Clear") {
        this.tempicon = "mdi-weather-partly-cloudy";
      }
      this.forecast[1].value = this.weather.main.pressure + " Pa";
    },


  },
});
</script>

<style>
.card {
  width: 50%;
}
.icon{
  transform: scale(5);
  margin-left: 100px;
}

</style>
