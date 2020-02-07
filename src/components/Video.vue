<template>
  <v-row>
    <v-col cols="10" class="mx-auto">
      <v-card>
        <v-container fluid>
          <v-row dense>
            <v-col cols="3" >
              <div class="add-button">

                <p class="text-center"
                   v-if="loading">
                  <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                  />
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
                  accept="video/*"
                  class="image-input"
                  @change="updateUploadButton($event), insertVideo()">
              </div>


              <div class="success" v-if="success_video">
                {{success_video}} Uploaded Successfully
              </div>

              <div class="error" v-if="errors">
                {{errors}}
              </div>


            </v-col>
            <v-col
              v-for="(video, i) of videos"
              :key="i"
              cols="3"
            >
              <v-card>
                <v-playback :url="require('../../videos/' + video.video)"/>

<!--                <div class="d-flex align-center justify-space-between">-->
<!--                  <v-card-text v-text="video.video"/>-->

<!--                  <v-btn-->
<!--                    size="md"-->
<!--                    color="error"-->
<!--                    @click="deleteImage(image.image)"-->
<!--                    class="cursor mr-4">-->
<!--                    Remove-->
<!--                  </v-btn>-->
<!--                </div>-->



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
    name: "Video",
    data() {
      return {
        errors: '',
        file: '',
        loading: false,
        success_video: false,
        videos: [],
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
      this.getVideo()
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
            this.success_video = response.data;
            this.loading = false;
            setTimeout(() => {
              this.$refs.uploadInput.value = ''
              this.getVideos();
            }, 900);

          })
          .catch(e => {
            this.errors.push(e)
          })
      },
      getVideo () {
        axios.get(`/video`, {
          params: {
            user: this.user.userId
          }
        })
          .then(response => {
            //console.log(response);
            this.videos = response.data;
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


    }

  }
</script>

