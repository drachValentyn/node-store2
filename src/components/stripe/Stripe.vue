<template>
  <v-container>

    <h2 class="title text-center">Bundle of Sticks</h2>

    <v-row class="align-stretch">

      <v-col cols="6">
        <v-img src="https://cdn.scotch.io/2842/b7yhhuUPSGO1fEkMHD6P_sticks.jpeg"/>
      </v-col>

      <v-col cols="3">

        <v-form>
          <section class="row payment-form">

            <div class="error red center-align white-text"></div>

            <div class="col s12 card-element">
              <label>Card Number</label>
              <div id="card-number-element" class="input-value"></div>
            </div>

            <div class="col s6 card-element">
              <label>Expiry Date</label>
              <div id="card-expiry-element"></div>
            </div>

            <div class="col s6 card-element">
              <label>CVC</label>
              <div id="card-cvc-element"></div>
            </div>

          </section>

        </v-form>

      </v-col>

      <v-col cols="3">
        <v-text-field label="Amount" placeholder="Amount" outlined v-model="amount"/>

        <v-text-field label="Name" placeholder="First and Last" outlined v-model="name"/>

        <v-text-field label="Email" placeholder="Email address" outlined v-model="email"/>

        <v-text-field label="Address" placeholder="123 Fake St #303" outlined v-model="address.street"/>

        <v-text-field label="City" placeholder="San Francisco" outlined v-model="address.city"/>

        <v-btn
          x-large
          color="success"
          :loading="loading"
          @click="placeOrderButtonPressed"
        >
          Place Order
        </v-btn>

      </v-col>

    </v-row>

    <v-snackbar
      v-model="snackbar"
      color="error"
    >
      {{stripeValidationError}}
      <v-btn
        color="black"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

  </v-container>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Purchase",
    data() {
      return {
        stripeAPIToken: 'pk_test_QJHfCb8Wj3u4SAONBJA53w9i00pJkL9rbJ',
        stripe: null,
        elements: '',
        cardNumberElement: null,
        cardExpiryElement: null,
        cardCVCElement: null,
        stripeValidationError: null,
        name: "John Snow",
        email: "snow@mail.com",
        amount: "25",
        address: {
          street: "123 Something Lane",
          city: "San Francisco",
        },
        snackbar: false,
        loader: null,
        loading: false,
      };
    },
    mounted() {
      this.configureStripe();
    },
    methods: {

      configureStripe() {
        this.stripe = Stripe(this.stripeAPIToken);
        this.createAndMountFormElements()
      },

      createAndMountFormElements() {
        let elements = this.stripe.elements();

        this.cardNumberElement = elements.create("cardNumber");
        this.cardNumberElement.mount("#card-number-element");

        this.cardNumberElement = elements.create("cardExpiry");
        this.cardNumberElement.mount("#card-expiry-element");

        this.cardNumberElement = elements.create("cardCvc");
        this.cardNumberElement.mount("#card-cvc-element");


        this.cardNumberElement.on("change", this.setValidationError);
        this.cardExpiryElement.on("change", this.setValidationError);
        this.cardCvcElement.on("change", this.setValidationError);
      },

      setValidationError(event) {
        this.stripeValidationError = event.error ? event.error.message : "";
      },

      placeOrderButtonPressed() {
        this.stripe.createToken(this.cardNumberElement).then(result => {
          if (result.error) {
            this.stripeValidationError = result.error.message;
          } else {
            let stripeObject = {
              amount: this.amount * 100,
              name: this.name,
              email: this.email,
              address: this.address,
              source: result.token
            };

            this.saveDataToMongo(stripeObject);

          }
        })
      },

      saveDataToMongo(stripeObject) {
        this.loading = true;
        axios.post(`/purchase`, stripeObject).then(res => {
          if (res.data.error) {
            this.stripeValidationError = res.data.error.raw.message;
          } else {
            console.log(res);
            this.loading = false;
            this.$router.push({
              path: `complete_purchase/${res.data.charge.id}`
            });
          }
        });
      }

    }
  };
</script>


<style scoped lang="scss">

  .payment-form {
    border: 1px solid rgba(0, 0, 0, 0.38);
    border-radius: 5px;
    flex-direction: column;

    h5 {
      margin: 0;
      padding: 10px;
      font-size: 1.2rem;
    }
  }

  .card-element {
    margin-top: 5px;
  }

  #card-number-element,
  #card-expiry-element,
  #card-cvc-element {
    background: white;
    padding: 5px;
    border: 1px solid #ececec;
  }

  .place-order-button-block {
    margin: 10px 0;
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
