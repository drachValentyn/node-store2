<template>
  <v-row>
    <v-col cols="12" class="text-center">
      <v-btn tile outlined color="success" @click="exportCsv()" class="mr-3">
        <v-icon left>mdi-pencil</v-icon>Export User
      </v-btn>

      <v-btn tile outlined color="primary" @click.prevent="selectCsv()">
        <v-icon left>mdi-pencil</v-icon>Import User
      </v-btn>

      <input
        id="upload"
        ref="uploadInput"
        type="file"
        name="file"
        class="image-input"
        @change="loadCSV($event)"
      />
    </v-col>

    <v-col cols="5" class="text-center mx-auto">
      <v-alert dense text v-if="exportMessage" type="success" class="mt-4">{{
        exportMessage
      }}</v-alert>

      <v-alert dense text v-if="errMessage" type="error" class="mt-4">{{
        errMessage
      }}</v-alert>
    </v-col>

    <v-container class="grey lighten-5" fluid>
      <v-col cols="8" class="mx-auto">
        <v-card class="pa-2" outlined>
          <v-simple-table>
            <h2>User List</h2>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">Name</th>
                  <th class="text-center">Login</th>
                  <th class="text-center">E-mail</th>
                  <th class="text-center">Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user._id" class="text-center">
                  <td>{{ user.name }}</td>
                  <td>{{ user.login }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.date }}</td>
                  <td>
                    <v-btn small color="primary" @click.stop="details(user._id)"
                      >Edit User</v-btn
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-container>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  name: "UserList",
  data() {
    return {
      fields: {
        name: "Name",
        login: "Login",
        email: "Email"
      },
      users: [],
      errors: [],
      parse_csv: [],
      sortOrders: {},
      exportMessage: "",
      errMessage: ""
    };
  },
  created() {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    axios
      .get(`http://localhost:4002/user`)
      .then(response => {
        this.users = response.data;
      })
      .catch(e => {
        this.errors.push(e);
        if (e.response.status === 401) {
          this.$router.push("/login");
        }
      });
  },
  methods: {
    details(userid) {
      this.$router.push(`/show-user/` + userid);
    },
    async exportCsv() {
      await axios
        .get(`http://localhost:4002/exports`)
        .then(response => {
          this.exportMessage = `File ${response.data} succesful created!`;
          setTimeout(() => {
            this.exportMessage = "";
          }, 3000);
        })
        .catch(e => {
          this.errors.push(e);
        });
    },
    selectCsv() {
      this.$refs.uploadInput.click();
    },
    csvJSON(csv) {
      let vm = this;
      let lines = csv.split("\n");
      let result = [];
      let headers = lines[0].split(",");

      lines.map(function(line, indexLine) {
        if (indexLine < 1) return;
        let obj = {};
        let currentline = line.split(",");

        headers.map(function(header) {
          obj["name"] = currentline[1];
          obj["login"] = currentline[2];
          obj["email"] = currentline[3];
        });
        result.push(obj);
      });
      return result;
    },
    loadCSV(e) {
      let vm = this;
      if (window.FileReader) {
        let reader = new FileReader();
        reader.readAsText(e.target.files[0]);
        reader.onload = function(event) {
          let csv = event.target.result;
          vm.parse_csv = vm.csvJSON(csv);
          vm.sendImport(vm.parse_csv);
        };
        reader.onerror = function(evt) {
          if (evt.target.error.name === "NotReadableError") {
            alert("Canno't read file !");
          }
        };
      } else {
        alert("FileReader are not supported in this browser.");
      }
    },
    sendImport(file) {
      axios
        .post(`http://localhost:4002/exports`, file)
        .then(response => {
          console.log(response);// eslint-disable-line no-console
          if (response.data.errmsg) {
            this.errMessage = response.data.errmsg;
            setTimeout(() => {
              this.errMessage = "";
            }, 5000);
          } else {
            this.exportMessage = "Uploading data success!";
            setTimeout(() => {
              this.exportMessage = "";
            }, 5000);
          }
        })
        .catch(e => {
          this.errors.push(e);
        });
    }
  }
};
</script>

<style scoped>
.image-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  opacity: 0;
}
</style>
