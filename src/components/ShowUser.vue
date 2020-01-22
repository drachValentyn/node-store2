<template>
  <v-card class="mx-auto mt-4" max-width="544" outlined>
    <v-list-item five-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-3">
          <h2>{{ users.name }}</h2>
        </v-list-item-title>

        <v-list-item-subtitle>
          <div class="mb-1">Login: {{ users.login }}</div>
          <div class="mb-1">E-mail: {{ users.email }}</div>
          <div class="mb-1">Date: {{ users.date }}</div>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-actions>
      <v-btn text color="success" @click.stop="editUser(users._id)">Edit</v-btn>
      <v-btn text color="error" @click.stop="deleteUser(users._id)"
        >Delete</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "ShowUser",
  data() {
    return {
      users: {}
    };
  },
  created() {
    axios
      .get(`http://localhost:4002/user/` + this.$route.params.id)
      .then(response => {
        this.users = response.data;
      })
      .catch(e => {
        this.errors.push(e);
      });
  },
  methods: {
    editUser(userid) {
      this.$router.push("/edit-user/" + userid);
    },
    deleteUser(userid) {
      axios
        .delete("http://localhost:4002/user/" + userid)
        .then(() => {
          this.$router.push({
            name: "UserList"
          });
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>
