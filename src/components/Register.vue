<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Registration form</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                prepend-icon="mdi-account"
                name="username"
                label="Username"
                type="text"
                :rules="usernameRules"
                v-model="username"
                required
              />

              <v-text-field
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                type="password"
                :counter="6"
                :rules="passRules"
                v-model="password"
              />

              <v-text-field
                id="confirmPassword"
                prepend-icon="mdi-lock"
                name="confirm-password"
                label="Confirm Password"
                type="password"
                :counter="6"
                :rules="confirmPassRules"
                v-model="confirmPassword"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="onSubmit" :disabled="!valid"
              >Register</v-btn
            >
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
      confirmPassword: "",
      register: {},
      errors: [],
      valid: false,
      usernameRules: [
        v => !!v || "Username is required",
        v =>
          (v && v.length >= 4) ||
          "Username must be equal or more than 6 characters"
      ],
      passRules: [
        v => !!v || "Password is required",
        v =>
          (v && v.length >= 6) ||
          "Password must be equal or more than 6 characters"
      ],
      confirmPassRules: [
        v => !!v || "Password is required",
        v => v === this.password || "Password should match"
      ]
    };
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.register = {
          username: this.username,
          password: this.password
        };

        axios
          .post(`http://localhost:4002/api/auth/register/`, this.register)
          .then(response => {
            this.$router.push({
              name: "Login"
            });
          })
          .catch(e => {
            console.log(e); // eslint-disable-line no-console
            this.errors.push(e);
          });
      }
    }
  }
};
</script>

<style scoped></style>
