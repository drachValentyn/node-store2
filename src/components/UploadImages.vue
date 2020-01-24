<template>
  <v-row>

    <v-col cols="12" class="text-center" v-if="user.loggedIn">
      <v-btn text to="/gallery">
        Browse images
      </v-btn>
      <v-btn text to="/upload">
        Upload images
      </v-btn>
    </v-col>

    <v-col cols="10" class="mx-auto">
      <v-card>
        <v-container fluid>
          <v-row dense>
            <v-col cols="3">
              <div class="add-button">

                <p class="text-center"
                   v-if="loading">
                  <strong>Uploading</strong>
                  {{ loadingText }}
                </p>

                <v-btn
                  size="md"
                  v-if="!loading"
                  color="primary"
                  @click="selectImage()"
                  class="cursor">
                  Select Image
                </v-btn>
                <input
                  id="upload"
                  ref="uploadInput"
                  type="file"
                  name="file"
                  class="image-input"
                  @change="updateUploadButton($event), insertImage()">
              </div>
            </v-col>

            <v-col
              v-for="(image, i) of images"
              :key="i"
              cols="3"
            >
              <v-card>

                <v-img
                  :src="require('../../uploads/' + image.image)"
                  class="white--text align-end"
                  height="200px"
                >
                  <v-card-title v-text="image.title"/>
                </v-img>

                <div
                  v-if="image.image"
                  class="remove-button">
                  <v-btn
                    size="md"
                    color="error"
                    @click="deleteImage(image.image)"
                    class="cursor">
                    Remove
                  </v-btn>
                </div>

              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import axios from "axios";
  import { mapGetters } from 'vuex'

  export default {
    name: "Gallery",
    data() {
      return {
        images: [],
        errors: [],
        file: '',
        loadingText: '',
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'user',
      })
    },
    created () {
      axios.defaults.headers.common['Authorization'] = localStorage.getItem(
        'jwtToken'
      );
      this.getImages()
    },
    methods: {
      getImages () {
        axios.get(`/uploads`, {
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
                name: 'Login'
              })
            }
          })
      },
      selectImage () {
        this.$refs.uploadInput.click()
      },
      updateUploadButton (e) {
        const fileName = e.target.value.split('\\').pop();
        if (fileName) {
          this.loadingText = fileName;
          this.loading = true
        }
      },
      insertImage () {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        this.file = this.$refs.uploadInput.files[0];
        let formData = new FormData();
        formData.append('file', this.file);
        axios.post(`/uploads`, formData, {
          params: {
            user: this.user.userId
          }
        })
          .then(response => {
            setTimeout(() => {
              this.loading = false;
              this.getImages();
              this.$refs.uploadInput.value = ''
            }, 900)
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      deleteImage (image) {
        axios.delete(`/uploads/${image}`)
          .then(result => {
            this.getImages()
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
    }

  }
</script>

<style scoped>
  .image-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 0px;
    height: 0px;
    overflow: hidden;
    opacity: 0;
  }

  .add-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: #f2f2f3;
    background-size: cover;
    background-position: 50% 50%;
  }

  .remove-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 15px;
    right: 15px;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: all 0.3s ease-in;
  }

  .remove-button:hover {
    opacity: 1;
  }
</style>
