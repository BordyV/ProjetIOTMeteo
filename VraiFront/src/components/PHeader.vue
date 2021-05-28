<template>
  <div>
    <v-app-bar
      dark
      style="background-color:#191970"
      
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Projet MERGUEZ</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout" >
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
   <v-navigation-drawer
            v-model="drawer"
            app
            absolute 
            bottom 
            temporary
    > 
      <v-sheet
              color="grey lighten-4"
              class="pa-4">
       <Profil>

       </Profil>
      </v-sheet>

      <v-divider></v-divider>
      <v-list
      v-for="lien in navbarButtons"
       :key="lien.href" 
       >
        <v-list-item :to="lien.href">
          <!-- ICON -->
          <v-list-item-icon>
            <v-icon>{{ lien.icon }}</v-icon>
          </v-list-item-icon>

          <!-- Text -->
          <v-list-item-content>
            <v-list-item-title >{{ lien.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

   
  </div>
</template>

<script>
export default {
  data: () => ({
      drawer: false,
      group: null,
      navbarButtons : {
      Map :{
        icon: 'mdi-google-maps',
        title: 'Map',
        href: '/map'
      },
      Profil :{
        icon: 'mdi-account',
        title: 'Profil',
        href: '/user/'
      },
      
    }
    }),
   mounted() {
     this.drawer =  false;
    if(this.$session.get('token')){
      this.Profil.href = this.connecte;
    }
    else{
      this.Profil.href = this.haveToCo;
    }
   },
    watch: {
     
      group () {
        this.drawer = false
      },
    },
  methods: {
    logout: function() {
             this.$session.destroy();
      console.log("cancel")
       this.$router.go('/login');
        }
  }
};
</script>

<style>
</style>