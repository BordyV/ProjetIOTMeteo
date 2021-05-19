<template>
  <div>
    <v-app-bar
      dark
      
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Projet MERGUEZ</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout" href="/">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      
      bottom
     
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>MAP</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>PROFIL</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
      drawer: false,
      group: null,
    }),
    watch: {
      group () {
        this.drawer = false
      },
    },
  methods: {
    logout: function() {
            this.$session.destroy();
            window.location.reload();
        }
  }
};
</script>

<style>
</style>