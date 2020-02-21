<template>
  <v-container>
    <v-row class="align-stretch">
      <v-col cols="6">

      </v-col>
      <v-col cols="3">
        <v-text-field label="Name" placeholder="First and Last" outlined v-model="name"/>

        <v-text-field label="Email" placeholder="Email address" outlined v-model="email"/>

        <v-text-field label="Address" placeholder="123 Fake St #303" outlined v-model="address.street"/>

        <v-text-field label="City" placeholder="San Francisco" outlined v-model="address.city"/>

        <div id="card-element"></div>


        <div class="help is-danger" v-if="cardCheckError">
          <span>{{ cardCheckErrorMessage }}</span>
        </div>

        <v-spacer/>

        <v-btn
          x-large
          color="success"
          @click="validate"
        >
          <span v-if="cardCheckSending">
            <i class="fa fa-btn fa-spinner fa-spin"></i>
            Ordering...
          </span>
          <span v-else>Place Order</span>
        </v-btn>

      </v-col>

    </v-row>
  </v-container>
</template>

<script>
  import axios from "axios";

  import {CardNumber, CardExpiry, CardCvc} from 'vue-stripe-elements-plus'

  export default {
    //props: ['stripe', 'options'],
    name: "Purchase",
    data() {
      return {
        // fieldsstripe

        stripeAPIToken: 'pk_test_QJHfCb8Wj3u4SAONBJA53w9i00pJkL9rbJ',
        stripe: '',
        elements: '',
        card: '',
        cardElement:'',

        name: "John Snow",
        email: "snow@mail.com",
        specialNote: "This is the text to put on the bundle of sticks",
        address: {
          street: "123 Something Lane",
          city: "San Francisco",
          state: "CA",
          zip: "94607"
        },

        // card: {
        //   number: "4242424242424242",
        //   cvc: "123",
        //   exp_month: "01",
        //   exp_year: "22"
        // },
        // validation
        cardNumberError: null,
        cardCvcError: null,
        cardMonthError: null,
        cardYearError: null,
        cardCheckSending: false,
        cardCheckError: false,
        cardCheckErrorMessage: ""
      };
    },
    components: {CardNumber, CardExpiry, CardCvc},
    watch: {
      number() {
        this.update()
      },
      expiry() {
        this.update()
      },
      cvc() {
        this.update()
      }
    },
    mounted() {
      this.includeStripe('js.stripe.com/v3/', function () {
        this.configureStripe();
      }.bind(this));
    },
    methods: {
      /*Includes Stripe.js dynamically*/
      includeStripe(URL, callback) {
        let documentTag = document, tag = 'script',
          object = documentTag.createElement(tag),
          scriptTag = documentTag.getElementsByTagName(tag)[0];
        object.src = '//' + URL;
        if (callback) {
          object.addEventListener('load', function (e) {
            callback(null, e);
          }, false);
        }
        scriptTag.parentNode.insertBefore(object, scriptTag);
      },
      /*Configures Stripe by setting up the elements and creating the card element.*/
      configureStripe() {
        this.stripe = Stripe(this.stripeAPIToken);
        this.elements = this.stripe.elements();
        this.card = this.elements.create('card', {
          'style': {
            'base': {
              'fontSize': '16px',
              'color': '#C1C7CD',
            },
            'invalid': {
              'color': 'red',
            },
          }
        });
        this.card.mount('#card-element');
        this.cardElement = this.elements.getElement('card');
      },

      validate(){
        console.log('click');
          var request = {
            name: this.name,
            email: this.email,
            engravingText: this.engravingText,
            address: this.address,
            card: this.cardElement,
          };
          console.log(request);
          this.stripe.createToken(request).then(function(result) {
            console.log(result)
          });

      },

      update() {
        this.complete = this.number && this.expiry && this.cvc;
        // field completed, find field to focus next
        if (this.number) {
          if (!this.expiry) {
            this.$refs.cardExpiry.focus()
          } else if (!this.cvc) {
            this.$refs.cardCvc.focus()
          }
        } else if (this.expiry) {
          if (!this.cvc) {
            this.$refs.cardCvc.focus()
          } else if (!this.number) {
            this.$refs.cardNumber.focus()
          }
        }
        // no focus magic for the CVC field as it gets complete with three
        // numbers, but can also have four
      },
      // createToken() {
      //   this.cardCheckError = false;
      //   // window.Stripe.setPublishableKey(this.stripeKey);
      //   stripe.createToken(this.card)
      //     .then((res) => {
      //       console.log(res);
      //       this.stripeResponseHandler(res);
      //     });
      //   this.cardCheckSending = true;
      // },
      stripeResponseHandler(status, response) {
        this.cardCheckSending = false;
        if (response.error) {
          this.cardCheckErrorMessage = response.error.message;
          this.cardCheckError = true;

          console.error(response.error);
        } else {
          //token to create a charge on our server
          let token_from_stripe = response.id;

          let request = {
            name: this.name,
            email: this.email,
            engravingText: this.engravingText,
            address: this.address,
            card: this.card,
            token_from_stripe
          };

          //Send to our server
          axios.post(`/purchase`, request).then(res => {
            let error = res.data.error;
            let charge = res.data.charge;
            if (error) {
              console.error(error);
            } else {
              this.$router.push({
                path: `order-complete/${charge.id}`
              });
            }
          });
        }
      }
    }
  };
</script>


<style scoped lang="scss">
  h2 {
    text-decoration: underline;
  }

  #card-element{
    margin-bottom: 30px;
    border: 1px solid rgba(0, 0, 0, 0.42);
    border-radius: 4px;
    padding: 15px;
  }

  .textarea:not([rows]) {
    max-height: 110px;
    min-height: 110px;
  }

  .container {
    margin-bottom: 30px;
  }

  .column > img {
    margin-top: 60px;
  }

  .button-field {
    display: flex;
    justify-content: center;
  }

  #left-line {
    margin-top: 27px;
  }
</style>
