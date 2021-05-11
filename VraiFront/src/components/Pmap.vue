<template>
 <div>
      
      
      <v-text-field
      v-model="position" 
            placeholder="adresse"
          ></v-text-field>

 <!-- <v-text-field
      v-model= "esp"
          
            placeholder="adresse d'un esp"
          ></v-text-field> -->

            <v-btn
      :disabled="!valid"
      color="success"
      class="mr-4"
      @click="loca"
    >
      Valider
    </v-btn>

  <div class="map">
    
    
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 80%; z-index:1;"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      
      
    </l-map>
 
  </div>
   </div>
</template>






<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, } from "vue2-leaflet";

export default {
  name: "Pmap",
  
  
     
     
  components: {
    LMap,
    LTileLayer,
  },
  
  data() {
    return {
       api_key:'d0f74ba55214c45401d7ae1941791222',
       url_base: 'https://api.openweathermap.org/data/2.5/',
      esp: '',
  position:"",
      zoom: 13,
       weather: {},
       dataEsp:{},
     
      valid: true,
      center: latLng(47.41322, -1.219482),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
     
      
      currentZoom: 11.5,
      

      
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true
    };
  },

 
  mounted () {
  //this.dataEspFetcher();
}  ,

  methods: {

    dataEspFetcher: async function(){
      await  fetch('http://localhost/meteo')
          .then(res => {
            console.log(res, res.json())
          
          })
      
    }
  ,
    fetchApiWeather: async function () {
        await fetch(`${this.url_base}weather?q=${this.position}&units=metric&APPID=${this.api_key}`)
         .then(res => {
          res.json().then(body => {
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

     loca: async function(){      
      var adr = this.position;
      
      adr.replaceAll(' ', '%20');
      adr.replaceAll(',', '%2C');
      
      const key = "pk.2a042f7fb2119042d73b548892eac47e"
      var url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${this.position}&limit=1&accept-language=fr&countrycodes=fr&format=json`
      fetch(url)
      .then(response =>  response.json())
      .then(res => {
       
       
        this.center = latLng(parseFloat(res[0].lat), parseFloat(res[0].lon));
        
      })
     
     this.show= true;
  this.fetchApiWeather();
    
    
  }
   
  },
  
};
</script>
<style>
.map{
  width: 2000px;
  height: 1000px;


}
</style>