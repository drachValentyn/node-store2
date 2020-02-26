<template>
    <div class='container'>

        <h3>Order complete!</h3>

        <p>Congratulations! Your order for Sticks will be shipped out within 1-2 business days</p>

        <div v-if='orderDetails'>
            <dl>
                <dt>Order Number</dt>
                <dd>{{ orderDetails.id }}</dd>
                <dt>Name</dt>
                <dd>{{ orderDetails.shipping.name }}</dd>
                <dt>Email</dt>
                <dd>{{ orderDetails.receipt_email }}</dd>
                <dt>Order Created</dt>
                <dd>{{ orderDetails.created | moment }}</dd>
                <dt>Payment Amount</dt>
                <dd>{{ orderDetails.amount | currency }}</dd>
                <dt>Shipping Address</dt>
                <dd>
                  {{ orderDetails.shipping.address.line1 }},
                  {{ orderDetails.shipping.address.city }}
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
    data() {
        return {
            orderDetails: false
        };
    },
    created() {
        let charge_id = this.$route.params.id;
      console.log(charge_id)
        axios.get(`/purchase/${charge_id}`)
        .then((res) => {
          console.log(res);
            this.orderDetails = res.data.charge;
        })
    },
    filters: {
        moment(date) {
            return moment.unix(date).format('MMMM Do, YYYY - h:mm a');
        },
        currency(amount) {
            return `${(amount/100).toFixed(2)}`
        }
    },
}
</script>

<style lang="scss">
    dt {
        font-weight: bold;
    }
</style>
