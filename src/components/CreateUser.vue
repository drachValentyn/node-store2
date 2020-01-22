<template>
  <v-container>
    <h2 class="text-center">
      Add New User
    </h2>

    <v-card class="pa-2 mx-auto" outlined max-width="700">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        enctype="multipart/form-data"
      >
        <v-text-field
          v-model="name"
          prepend-icon="mdi-account"
          :error-messages="nameErrors"
          :counter="10"
          label="Name"
          @input="$v.name.$touch()"
          @blur="$v.name.$touch()"
          required
        />

        <v-text-field
          v-model="login"
          prepend-icon="mdi-pencil"
          :error-messages="loginErrors"
          :counter="10"
          label="Login"
          @input="$v.login.$touch()"
          @blur="$v.login.$touch()"
          required
        />

        <v-text-field
          v-model="email"
          prepend-icon="mdi-email"
          :error-messages="emailErrors"
          label="E-mail"
          @input="$v.email.$touch()"
          @blur="$v.email.$touch()"
          required
        />

        <v-btn
          :disabled="!valid"
          color="success"
          class="ml-5"
          @click="onSubmit"
        >
          submit
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";

export default {
  name: "CreateUser",
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
    async onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.user = {
          name: this.name,
          login: this.login,
          email: this.email
        };
        try {
          await axios
            .post(`http://localhost:4002/user/`, this.user)
            .then(res => {
              this.$router.push({
                name: "ShowUser",
                params: { id: res.data._id }
              });
            })
            .catch(e => {
              this.errors.push(e);
            });
        } catch (e) {
          console.log(e); // eslint-disable-line no-console
        }
      }
    }
  }
};
</script>
