<template>
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
                ><br />
                {{ userInfos.userAddress }}<br />
                {{ userInfos.userPhoneNumber }}
              </div>
            </v-card-text>
          </v-card>

          <v-spacer></v-spacer>
          <v-flex class="pa-2">
            <SkillFormPopup
              v-bind:idUser="userInfos._id"
              class="pa-2"
              v-show="isAdmin"
            />
            <ProjectFormPopup
              v-bind:idUser="userInfos._id"
              class="pa-2"
              v-show="isAdmin"
            />
            <PictureForm
              v-bind:idUser="userInfos._id"
              class="pa-2"
              v-show="isAdmin"
            />

            <v-layout justify-center>
              <v-btn
                color="red"
                dark
                v-on:click="logout"
                v-show="isAdmin"
                width="80%"
              >
                Se déconnecter
              </v-btn>
              <v-btn color="red" dark href="/" v-show="!isAdmin" width="80%">
                Quitter
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
                            label="adresse*"
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
                        dialog = false;

                    >
                      Ajouter
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </v-card>

          <v-card >
            <v-col
                v-for="esp in listEsp"
                :key="esp.adresseMac"
                cols="6"
                rounded="lg"
            >
              <v-card elevation="5" class="pa-5">
                <p> {{esp.adresseMac}}</p>
                <hr>
                <p> Position: latitude  {{esp.adresse.lat}}, longitude {{esp.adresse.lng}}</p>
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
</template>

<script>
// Popup Import

export default {
  components: {},
  name: "user",

  data() {
    return {
      listEsp: [],
      dialog: false,
      show: false,
      adresseMac: "",
      adresse: "",
      userInfos: "",
      userId: "",
    };
  },
  mounted: async function () {
    this.getMyEsps();
    if (this.$session.get("userId")) {
      this.isAdmin = true;
    }
    else{
       this.$router.push({ name: "login" });
    }
    await this.getUserInfos();
    console.log(this.userInfos);

    this.userInfos.userFirstName = this.capitalizeFirstLetter(
      this.userInfos.userFirstName
    );
    console.log('id: ',this.$session.get("userId"));
  },
  methods: {
    addEsp: async function () {
      let body = {
        userId : this.$session.get('userId'),
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
    getUserInfos: async function () {
      var jsonContent = await fetch(
        `http://localhost:3000/user/id/${this.$route.params.idUser}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": this.$session.get("token"),
          },
        }
      );

      var json = await jsonContent.json();
      this.userInfos = json[0];
      this.carte = true;
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
    getMyEsps: async function (){
      console.log(this.$route.params.idUser);
      var jsonContent = await fetch(
          `http://localhost:3000/esp/getEsp/${this.$route.params.idUser}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$session.get("token"),
            },
          }
      );

      var json = await jsonContent.json();
      this.listEsp = json;
    },


  }
};
</script>
<style lang="css" scoped>
h3.capitalize {
  text-transform: capitalize;
}

</style>
