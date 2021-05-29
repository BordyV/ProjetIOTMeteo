<template>
  <div>

    <div v-if="token === undefined"  class="pasCo">
      <v-btn href="/iotMeteo/#/login"> Veuillez vous connecter pour acceder a ce contenu</v-btn>
    </div>
    <div v-if="token">
      <spinner :showSpinner="showSpinner"></spinner>
      <v-main class="grey lighten-3">

        <v-container>
          <v-row>
            <v-col cols="12" sm="3">
              <v-card rounded="lg" min-height="268" elevation="5">
                <v-img rounded="lg" :src="`${userInfos.picUrl}`"></v-img>
                <!--  -->
                <v-card-text>
                  <h3>
                    {{ userInfos.userLastName + " " + userInfos.userFirstName }}
                  </h3>
                  <div>
                    <a :href="`mailto:${userInfos.userEmail}`">
                      {{ userInfos.userEmail }}</a
                    ><br/>
                    {{ userInfos.userAddress }}<br/>
                    {{ userInfos.userPhoneNumber }}
                  </div>
                </v-card-text>
              </v-card>

              <v-spacer></v-spacer>
              <v-flex class="pa-2">


                <v-layout justify-center>
                  <v-btn
                      color="red"
                      dark
                      v-on:click="logout"

                      width="80%"
                  >
                    Se déconnecter
                  </v-btn>

                </v-layout>
              </v-flex>
            </v-col>

            <v-col cols="12" sm="7">
              <!-- <v-container > -->

              <v-card>
                Ajouter mon esp
                <v-row justify="center">
                  <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" dark v-bind="attrs" v-on="on">
                        Open Dialog
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">Paramètres de l'esp</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field
                                  v-model="adresseMac"
                                  label="adresseMac"
                                  required
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                  v-model="adresse"
                                  label="adresse"
                                  required
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                        <small>*Champs obligatoires</small>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialog = false">
                          Fermer
                        </v-btn>
                        <v-btn
                            color="blue darken-1"
                            text
                            @click="addEsp"
                            dialog=false;

                        >
                          Ajouter
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
              </v-card>

              <v-card v-if="listEsp">
                <v-col
                    v-for="esp in listEsp"
                    :key="esp.adresseMac"
                    cols="6"
                    rounded="lg"
                >
                  <v-card elevation="5" class="pa-5" v-if="espDataLoaded">
                    <p> {{ esp.adresseMac }}</p>
                    <hr>
                    <p > Position: latitude {{ esp.adresse.lat }}, longitude {{ esp.adresse.lng }}</p>
                  </v-card>
                </v-col>
              </v-card>

            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <!-- <v-main>
          <v-container>
            <v-row>
                <v-col cols="0">
                <v-card outlined tile elevation="5" height="200px"></v-card>
                </v-col>
            </v-row>
                <v-row>
              <v-col
                v-for="n in 24"
                :key="n"
                cols="4"
              >
                <v-card height="200"></v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-main> -->
    </div>

  </div>
</template>

<script>
// Popup Import

import Spinner from "@/components/Spinner";

export default {
  components: {Spinner,},
  name: "user",

  data() {
    return {
      listEsp: [],
      showSpinner: false,
      dialog: false,
      show: false,
      adresseMac: undefined,
      adresse: undefined,
      userInfos: undefined,
      userId: undefined,
      token: undefined,
      nom: undefined,
      prenom:undefined,
      espDataLoaded: false
    };
  },
  mounted() {
    console.log('tokenSession', this.$session.get('token'));
    if (this.$session.get("userId")) {
      this.token = this.$session.get('token');
      this.userId = this.$session.get("userId");
      this.getMyEsps();
      this.getUserInfos();


    }
  },
  methods: {
    addEsp: async function () {
      let body = {
        userId: this.$session.get('userId'),
        adresseMac: this.adresseMac,
        adresse: this.adresse,
      };
      fetch("http://localhost:3000/esp/AddEsp", {
        method: "post",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": this.$session.get("token"),
        },
      });
      alert(`L'esp a été ajouté avec succès !`);
    },
    getUserInfos: function () {
      this.showSpinner = true;
      fetch(
          `http://localhost:3000/user/id/${this.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$session.get("token"),
            },
          }
      ).then((e) => e.json()
          .then((json) => {
            this.userInfos = json[0];
            console.log('les donnees user: ',this.userInfos);

            this.nom = this.capitalizeFirstLetter(
                json[0].userFirstName
            );
            this.nom = json[0].userLastName;
            this.showSpinner = false;

          })
      );
    },

    capitalizeFirstLetter: function (string) {
      string = string.toLowerCase();
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    logout: function () {
      this.$session.destroy();
      console.log("cancel")
      this.$router.go('/');
    },
    getMyEsps: async function () {
      this.showSpinner = true;
      var jsonContent = await fetch(
          `http://localhost:3000/esp/getEsp/${this.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$session.get("token"),
            },
          }
      );
      this.showSpinner = false;
      this.listEsp = await jsonContent.json();
      if(this.listEsp.length){
        this.espDataLoaded = false;
      }
      else if(this.listEsp.length>0){
        this.espDataLoaded = true;
      }


    },


  }
};
</script>
<style lang="css" scoped>
h3.capitalize {
  text-transform: capitalize;
}
.pasCo{
  display: flex;
  justify-content: center;
  margin-top: 300px;
}

</style>
