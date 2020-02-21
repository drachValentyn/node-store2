import Vue from 'vue';
import VueRouter from 'vue-router';
import UserList from "@/components/user/UserList";
import CreateUser from "@/components/user/CreateUser";
import EditUser from "@/components/user/EditUser";
import ShowUser from "@/components/user/ShowUser";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Gallery from "@/components/Gallery";
import UploadImages from "@/components/UploadImages";
import Video from "@/components/Video";
import Purchase from "@/components/stripe/Stripe";
import CompletePurchase from "@/components/stripe/CompletePay";

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
    path: "/video",
    name: "Video",
    component: Video
  },
  {
    path: "/purchase",
    name: "Purchase",
    component: Purchase
  },
  {
    path: "/complete_purchase",
    name: "CompletePurchase",
    component: CompletePurchase
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
