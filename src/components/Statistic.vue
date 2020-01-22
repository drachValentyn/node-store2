<template>
  <div class="container">
    <div class="row text-center chart-container">
      <h2 class="title">Realtime Chart with Vue and Pusher</h2>
      <h3 class="subtitle">Expense and Income Tracker</h3>
      <line-chart :chart-data="datacollection" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Pusher from "pusher-js";
import LineChart from "@/components/LineChart";
const socket = new Pusher("0a8f937aef4cad7b92ea", {
  cluster: "eu",
  encrypted: true
});
const channel = socket.subscribe("finance");
export default {
  name: "home",
  components: { LineChart },
  data() {
    return {
      expense: null,
      income: null,
      date: null,
      expenseamount: null,
      incomeamount: null,
      datacollection: null
    };
  },
  created() {
    this.fillData();
    this.fetchData();
  },
  methods: {
    fillData() {
      axios
        .get(`http://localhost:4002/charts`)
        .then(response => {
          let results = response.data.data;
          let dateresult = results.map(a => a.date);
          let expenseresult = results.map(a => a.expense);
          let incomeresult = results.map(a => a.income);
          this.expense = expenseresult;
          this.income = incomeresult;
          this.date = dateresult;
          this.datacollection = {
            labels: this.date,
            datasets: [
              {
                label: "Expense",
                backgroundColor: "#f87979",
                data: this.expense
              },
              {
                label: "Income",
                backgroundColor: "#5bf8bf",
                data: this.income
              }
            ]
          };
        })
        .catch(error => {
          console.log(error);// eslint-disable-line no-console
        });
    },
    fetchData() {
      channel.bind("new-expense", data => {
        let results = data.newExpense.data;
        let dateresult = results.map(a => a.date);
        let expenseresult = results.map(a => a.expense);
        let incomeresult = results.map(a => a.income);
        this.expense = expenseresult;
        this.income = incomeresult;
        this.date = dateresult;
        this.datacollection = {
          labels: this.date,
          datasets: [
            {
              label: "Expense Charts",
              backgroundColor: "#f87979",
              data: this.expense
            },
            {
              label: "Income Charts",
              backgroundColor: "#5bf8bf",
              data: this.income
            }
          ]
        };
      });
    }
  }
};
</script>

<style>
.chart-container {
  position: relative;
  margin: auto;
  height: 80vh;
  width: 80vw;
}

.title {
  text-align: center;
  margin-top: 40px;
}
.subtitle {
  text-align: center;
}
</style>
