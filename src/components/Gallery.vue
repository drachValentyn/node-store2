<template>
  <v-row>

    <v-col cols="12" class="text-center" v-if="user.loggedIn">
      <v-btn text to="/upload">
        Upload images
      </v-btn>
    </v-col>

    <v-col cols="10" sm="6" class="mx-auto">
      <v-card>
        <v-container fluid>
          <v-row>
            <v-col
              v-for="(image, i) of images"
              :key="i"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card flat tile class="d-flex">
                <v-img
                  :src="require('../../uploads/' + image.image)"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      />
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </v-col>

            <v-col
              class="d-flex child-flex"
              cols="10"
              v-if="images.length === 0"
            >
              <h1>Doh! Looks like you haven't uploaded any images.</h1>
              <v-btn
                size="md"
                variant="primary"
                @click="uploadImages()"
                class="cursor"
              >
                Upload images
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Gallery",
  data() {
    return {
      images: [],
      errors: []
    };
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  created() {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    this.getImages();
  },
  methods: {
    getImages() {
      axios
        .get(`/uploads`, {
          params: {
            user: this.user.userId
          }
        })
        .then(response => {
          this.images = response.data;
        })
        .catch(e => {
          this.errors.push(e);
          if (e.response.status === 401) {
            this.$router.push({
              name: "Login"
            });
          }
        });
    },
    uploadImages() {
      this.$router.push({
        name: "UploadImages"
      });
    }
  }
};
</script>

