<template>
  <div>
    <v-toolbar
      dark
      prominent
      src="https://www.fapnado.com/contents/models/26/s2_s2_abella%20danger1.jpg"
    >
      

      <v-toolbar-title>Projet MERGUEZ</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout" href="/">
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
export default {
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