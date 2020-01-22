import Vue from 'vue';
import VueRouter from 'vue-router';
import UserList from "@/components/UserList";
import CreateUser from "@/components/CreateUser";
import EditUser from "@/components/EditUser";
import ShowUser from "@/components/ShowUser";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Gallery from "@/components/Gallery";
import UploadImages from "@/components/UploadImages";
import Statistic from "@/components/Statistic";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "UserList",
    component: UserList
  },
  {
    path: "/show-user/:id",
    name: "ShowUser",
    component: ShowUser
  },
  {
    path: "/add-user",
    name: "CreateUser",
    component: CreateUser
  },
  {
    path: "/edit-user/:id",
    name: "EditUser",
    component: EditUser
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery
  },
  {
    path: "/upload",
    name: "UploadImages",
    component: UploadImages
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/statistic",
    name: "Statistic",
    component: Statistic
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
