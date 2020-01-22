/* eslint-disable no-console */
<template>
  <v-row>
    <v-col cols="12" sm="6" offset-sm="3">
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
                  :src="image.image"
                  :lazy-src="image.image"
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
        .get(`http://localhost:4002/uploads`, {
          params: {
            user: this.user.userId
          }
        })
        .then(response => {
          this.images = response.data;
          console.log(this.images);// eslint-disable-line no-console
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

<style scoped></style>
