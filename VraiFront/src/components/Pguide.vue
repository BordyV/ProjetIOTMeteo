<template>
  <div class="page">
      <h1 class="titleguide">
          INSTRUCTIONS

      </h1>
      <v-flex class="introguide">
          Notre application "TITRE A COMPLETER" consiste à observer les statistiques météorologiques
           en France avec une recherche par ville, mais aussi de connaitre les statistiques météorologiques des esp que chaque utilisateur, rajoute

      </v-flex>
        <div class="flexguide">
      <v-flex>Pour accéder à la page météo afin de rechercher la météo dans les villes <br> cliquez <br> <v-btn style="background-color:#191970;color:white" class="boutonguide" :to="navbarButtons.PMap.href">ICI</v-btn></v-flex>
      <v-flex>Pour accéder à la page User afin de modifier vos données personnelles et ajouter vos ESP <br> cliquez <br>  <v-btn style="background-color:#191970;color:white" class="boutonguide" :to="navbarButtons.Profil.href">ICI</v-btn></v-flex>
        </div>
  
          
     
  </div>
</template>

<script>
export default {
data: () => ({
    navbarButtons : {
      PMap :{
       
        href: '/map'
      },
      Profil :{
        
        href: '/user/'
      },
      

    }
}),
}
</script>

<style>
.titleguide{
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
}
.introguide{
     text-align: center;
     font-weight: 600;
     margin-bottom: 20px;
}
.flexguide{
    display: flex;
    text-align: center;
}
.boutonguide{
    text-align: center;
   
}

</style>