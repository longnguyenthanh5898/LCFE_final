<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link v-if="isAuthenticated" to="/home" class="nav-link">
            <i class="fa fa-home" />
            Home
          </router-link>
          <span v-else class="nav-link" @click="redirectToLogin">
            <i class="fa fa-home" />
            Home
          </span>
        </li>
      </div>

      <div  v-if="isAuthenticated" class="navbar-nav ml-auto" >
        <li  class="nav-item">
          <span  class="nav-link"  @click="logOut">
            <i class="fa fa-sign-out" />
            LogOut
          </span>
        </li>
       
    </div>
    <div v-else class="navbar-nav ml-auto" >
        <li class="nav-item">
        <router-link  to="/register" class="nav-link" @click="() => alert(124)">
          <i class="fa fa-user-plus" />
          Sign Up
        </router-link>
      </li>
      <li  class="nav-item">
        <router-link to="/login" class="nav-link">
          <i class="fa fa-sign-in" />
          Login
        </router-link>
      </li>
    </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      isAuthenticated: false,
      user: null,
    };
  },
  methods: {
    logOut() {
          localStorage.removeItem("response"); // Remove the token from localStorage
          localStorage.removeItem("currentUser"); // Remove the token from localStorage
          this.isAuthenticated = false;
          this.checkAuthentication()
          this.user = null;
          this.$router.push("/login");
    },
    redirectToLogin() {
      this.$router.push("/login");
    },
      checkAuthentication() {
        const token = localStorage.getItem("response");
        const user = localStorage.getItem("currentUser");
      
      if (token && user) {
          this.isAuthenticated = true;
          this.user = user
          this.$router.push("/home");
      } else {
          this.isAuthenticated = false;
          this.user = null
          this.$router.push("/login");
      }
    },
  },
  created() {
      this.checkAuthentication();
    },
    mounted() {
       
    this.checkAuthentication()
  }
};
</script>
<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
