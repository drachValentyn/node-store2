<template>
  <v-container>
    <h2>
      Edit User
      <v-btn color="success" text :to="/show-user/ + this.$route.params.id"
        >(Show User)</v-btn
      >
    </h2>

    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="name"
        :error-messages="nameErrors"
        :counter="10"
        label="Name"
        @input="$v.name.$touch()"
        @blur="$v.name.$touch()"
        required
      />

      <v-text-field
        v-model="login"
        :error-messages="loginErrors"
        :counter="10"
        label="Login"
        @input="$v.login.$touch()"
        @blur="$v.login.$touch()"
        required
      />

      <v-text-field
        v-model="email"
        :error-messages="emailErrors"
        label="E-mail"
        @input="$v.email.$touch()"
        @blur="$v.email.$touch()"
        required
      />

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="onSubmit">
        submit
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

export default {
  name: "EditUser",
  data() {
    return {
      valid: false,
      user: {},
      name: "",
      login: "",
      email: ""
    };
  },
  mixins: [validationMixin],

  validations: {
    name: {
      required,
      maxLength: maxLength(10)
    },
    login: {
      required,
      maxLength: maxLength(10)
    },
    email: {
      required,
      email
    }
  },
  created() {
    axios
      .get("http://localhost:4002/user/" + this.$route.params.id)
      .then(response => {
        let res = response.data;
        this.name = res.name;
        this.login = res.login;
        this.email = res.email;
      })
      .catch(e => {
        this.errors.push(e);
      });
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
    loginErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Login must be at most 10 characters long");
      !this.$v.name.required && errors.push("Login is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    }
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.user = {
          name: this.name,
          login: this.login,
          email: this.email
        };
        axios
          .put(`http://localhost:4002/user/` + this.$route.params.id, this.user)
          .then(response => {
            this.$router.push("/show-user/" + this.$route.params.id);
          })
          .catch(e => {
            this.errors.push(e);
          });
      }
    }
  }
};
</script>
