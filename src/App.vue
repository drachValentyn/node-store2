<template>
  <v-app>

    <sp-header/>

    <v-content>
      <v-container>
        <router-view/>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SpHeader from '@/views/Header.vue'

  export default {
    data() {
      return {}
    },
    components: {
      SpHeader
    },
    computed: {
      ...mapGetters({
        user: 'user',
      })
    },
    created() {
      this.auth = localStorage.getItem("jwtToken");
      let getUser = JSON.parse(localStorage.getItem('newUser'));
      if (getUser !== null) {
        this.$store.state.user = getUser
      }
      this.auth = localStorage.getItem("jwtToken");
    }
  };
</script>
