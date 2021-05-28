<template>
  <v-app>
      
    <PHeader/>
    <router-view/>
    <!-- <recherchePersonne/> -->

    <footer>
     
    </footer>
  
  </v-app>
  
</template>

<script>

 import PHeader from "./components/PHeader";







export default {
  name: "App",
  mounted(){
    if(!this.authenticated) {
                // this.$router.replace({ name: "login" });

            }else{
                this.$router.replace({ name: "map" });
                
            }
  },
  components: {
    "PHeader" : PHeader,
    //"Pmap" : Pmap,
    // "recherchePersonne" : recherchePersonne,
   
    
    //"LoginRegister" : LoginRegister
  },
  data () {
    return {
      // component : "recherchePersonne",
      authenticated : false,
      userId : ''
    }
  }
,
methods :
{

}
}
</script>

<style>
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
