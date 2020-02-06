<template>
  <v-row>
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
                  @click="selectVideo()"
                  class="cursor">
                  Select Video
                </v-btn>
                <input
                  id="upload"
                  ref="uploadInput"
                  type="file"
                  name="file"
                  class="image-input"
                  @change="updateUploadButton($event), insertVideo()">
              </div>
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
    name: "Video",
    data() {
      return {
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
      //this.insertVideo()
    },
    methods: {

      selectVideo () {
        this.$refs.uploadInput.click()
      },
      updateUploadButton (e) {
        const fileName = e.target.value.split('\\').pop();
        if (fileName) {
          this.loadingText = fileName;
          this.loading = true
        }
      },
      insertVideo () {
        axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
        this.file = this.$refs.uploadInput.files[0];
        let formData = new FormData();
        formData.append('file', this.file);
        axios.post(`/video`, formData, {
          params: {
            user: this.user.userId
          }
        })
          .then(response => {

            console.log(response);
            
            setTimeout(() => {
              this.loading = false;
            }, 900)
          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      // getVideo () {
      //   axios.get(`/video`, {
      //     params: {
      //       user: this.user.userId
      //     }
      //   })
      //     .then(response => {
      //       console.log(response);
      //       console.log(this.user.userId);
      //       })
      //     .catch(e => {
      //       this.errors.push(e);
      //       if (e.response.status === 401) {
      //         this.$router.push({
      //           name: 'Login'
      //         })
      //       }
      //     })
      // },
           
    
    }

  }
</script>
