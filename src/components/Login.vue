<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login form</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid" ref="form" validation>
              <v-text-field
                name="username"
                label="Username"
                type="text"
                v-model="username"
                :counter="4"
                :rules="usernameRules"
                required
              />

              <v-text-field
                id="password"
                name="password"
                label="Password"
                type="password"
                :counter="5"
                :rules="passRules"
                v-model="password"
                required
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="onSubmit" :disabled="!valid"
              >Login</v-btn
            >

            <v-btn color="primary" @click.stop="register()">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      admin: {},
      valid: false,
      passRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length >= 5) ||
          "Password must be equal or more than 6 characters"
      ],
      usernameRules: [
        v => !!v || "Username is required",
        v =>
          (v && v.length >= 4) ||
          "Username must be equal or more than 4 characters"
      ]
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.admin = {
          username: this.username,
          password: this.password
        };

        axios
          .post(`http://localhost:4002/api/auth/login/`, this.admin)
          .then(response => {
            localStorage.setItem("jwtToken", response.data.token);
            this.$router.push("/");
          })
          .catch(e => {
            console.log(e); // eslint-disable-line no-console
            this.errors.push(e);
          });
      }
    },
    register() {
      this.$router.push({
        name: "Register"
      });
    }
  },
  created() {
    if (this.$route.query["loginError"]) {
      this.$store.dispatch("setError", "Please login to access this page.");
    }
  }
};
</script>

<style scoped></style>
