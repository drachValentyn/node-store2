<template>
  <div>
    <v-container class="purchase-container">
      <form ref="form" id="payment-form" @submit="submit">
        <div class="form-row">
          <label for="card-element">Credit or debit card</label>
          <div id="card-element">
            <!-- A Stripe Element will be inserted here. -->
          </div>

          <!-- Used to display form errors. -->

          <div id="card-errors" role="alert"></div>
        </div>

        <button>Submit Payment</button>
      </form>
    </v-container>
  </div>
</template>

<script>
const stripe = Stripe("pk_test_QJHfCb8Wj3u4SAONBJA53w9i00pJkL9rbJ");
let card = '';
export default {
  name: "Purchase",
  data() {
    return {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      }
    };
  },
  mounted() {
    const elements = stripe.elements();
    card = elements.create("card", { style: this.style });
    card.mount("#card-element");
    card.addEventListener("change", function(event) {
      var displayError = document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });
  },
  methods: {
      stripeTokenHandler(token) {
        console.log('token');
        
      // Insert the token ID into the form so it gets submitted to the server
      var form = document.getElementById("payment-form");
      var hiddenInput = document.createElement("input");
      hiddenInput.setAttribute("type", "hidden");
      hiddenInput.setAttribute("name", "stripeToken");
      hiddenInput.setAttribute("value", token.id);
      form.appendChild(hiddenInput);

      console.log(form);
      
    },
    submit(event) {
      event.preventDefault();

    //   stripe.createToken(card).then(function(result) {
    //     if (result.error) {
    //       // Inform the user if there was an error.
    //       var errorElement = document.getElementById("card-errors");
    //       errorElement.textContent = result.error.message;
    //     } else {
    //         console.log('tok');
    //         console.log(result);
            
    //       // Send the token to your server.
    //       this.stripeTokenHandler(result.token);
    //     }
    //   });
    },
    
  }
};
</script>


<style scoped lang="scss">
.purchase-container {
  font-family: Helvetica Neue, Helvetica, sans-serif;
  color: #6b7c93;
  font-smoothing: antialiased;
  font-size: 16px;
  form {
    max-width: 30%;
    margin: auto;
  }
}

.StripeElement {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}

button {
  border: none;
  border-radius: 4px;
  outline: none;
  text-decoration: none;
  color: #fff;
  background: #32325d;
  white-space: nowrap;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-decoration: none;
  transition: all 150ms ease;
  margin-left: 12px;
  margin-top: 28px;
}
label {
  font-weight: 500;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}
</style>