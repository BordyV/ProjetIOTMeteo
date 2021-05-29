<template>
  <div class="page">
    <div class="middle">
      <h1 class="titleguide">
          INSTRUCTIONS

      </h1>
      
      <v-flex class="introguide">  Le but de l'application est de d'observer les données météorologiques données depuis l'api de openWeatherMeteo grâce à la page MAP qui nous permet de faire une recherche par ville en France, mais aussi d'analyser les données météorologiques qu'émettent les esp ajoutés par chaque utilisateur.
      </v-flex>
      <v-flex class="fonce"> La page MAP : 
      </v-flex>
      <v-flex class="introguide">  La page map permet de rechercher la météo d'une ville en particulier en France et d'en ressortir la position sur la carte et les résultats sous forme de statistiques : 
      </v-flex>
      <v-img
  
  src="/../assets/map.PNG"
></v-img>
<v-flex class="introguide">De plus, comme vous pouvez voir le marqueur rouge permet de connaître l'emplacement de la recherche avec des statistiques comme la température, l'humidité ou la pression de la ville.
      </v-flex>
      <v-flex class="introguide">Enfin, on peut voir des marqueurs bleus qui représente les esp de chaque utilisateur et on peut voir les détails de données en cliquant sur le marqueur.
      </v-flex>
<!-- METTRE IMAGE-->


<v-flex class="fonce"> La page PROFIL : 
      </v-flex>
      <v-flex class="introguide">  La page profil permet de gérer son compte et d'ajouter les esp qu'ils possédent : 
      </v-flex>
      <!-- METTRE IMAGE-->



        <div class="flexguide">
      <v-flex>Pour accéder à la page météo afin de rechercher la météo dans les villes <br> cliquez <br> <v-btn style="background-color:#191970;color:white" class="boutonguide" :to="navbarButtons.PMap.href">ICI</v-btn></v-flex>
      <v-flex>Pour accéder à la page User afin de modifier vos données personnelles et ajouter vos ESP <br> cliquez <br>  <v-btn style="background-color:#191970;color:white" class="boutonguide" :to="navbarButtons.Profil.href">ICI</v-btn></v-flex>
        </div>
  
          
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
.middle{
  margin-left: auto;
  margin-right: auto;
  width: 80%;
}
.fonce{
   font-weight: 600;
   font-size: 30px;
}

</style>