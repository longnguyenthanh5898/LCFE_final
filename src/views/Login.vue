<!-- eslint-disable prettier/prettier -->
<template>
  <div class="login-page">
    <div class="card">
      <div class="header-container">
        <i class="fa fa-user" />
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success" role="alert">
        {{ successMessage }}
      </div>
      <form
        name="form"
        @submit.prevent="handleLogin"
        novalidate
        :class="submitted ? 'was-validated' : ''"
      >
        <div class="form-group">
          <label for="userId"> Member Id</label>
          <input
            type="number"
            v-model="formData.customer_id"
            class="form-control"
            name="customer_id"
            id="customer_id"
            placeholder="Member Id"
            @input="validateId"
            required
          />
          <div
            class="invalid-feedback"
            :style="{ display: isIdValid ? 'none' : 'block' }"
          >
            ID must be at least 4 digits long.
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password </label>
          <input
            type="password"
            v-model="formData.password"
            class="form-control"
            name="password"
            id="password"
            placeholder="Password"
            @input="validatePassword"
            required
          />
          <div
            class="invalid-feedback"
            :style="{ display: isPasswordValid ? 'none' : 'block' }"
          >
            {{ passwordErrorMessage }}
          </div>
        </div>

        <button
          class="btn btn-primary btn-block"
          @click="submitted = true"
          :disabled="loading"
        >
          Login
        </button>
      </form>

      <a href="/register" class="card-link">Create New Account!</a>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import UserService from "../services/user.service";
import User from "../models/user";
import vuex from "vuex";

export default {
  name: "login",
  data() {
    return {
      formData: new User("", ""),
      loading: false,
      submitted: false,
      errorMessage: "",
      successMessage: "",
      isIdValid: true,
      isPasswordValid: true,
      passwordErrorMessage: "",
    };
  },
  computed: {
    ...vuex.mapGetters(["user", "loginResponse"]),
  },
  mounted() {
    if (this.user && this.user.customer_id) {
      this.$router.push("/home");
    }
  },
  methods: {
    ...vuex.mapActions(["updateUser", "saveLoginResponse"]),

    async handleLogin() {
      if (!this.formData.customer_id || !this.formData.password) {
        return;
      }
      this.loading = true;
      try {
        const response = await UserService.login(this.formData);
        // Store pure password for further operations.
        this.saveLoginResponse(response.data);

        this.successMessage = "Login successfully !";
        setTimeout(() => {
          this.$router.push("/home");
        }, 1000);
      } catch (error) {
        console.log(error);
        this.errorMessage = "MemberID or password is valid";
      } finally {
        this.loading = false;
      }
    },
    validateId() {
      // Check if ID is at least 4 digits long
      this.isIdValid = /^[0-9]{4,}$/.test(this.formData.customer_id);
    },
    validatePassword() {
      // Your custom password validation logic goes here
      const password = this.formData.password;

      // Count the number of character types present (numbers, letters, and special characters)
      const characterTypesCount =
        (/[0-9]/.test(password) ? 1 : 0) +
        (/[a-zA-Z]/.test(password) ? 1 : 0) +
        (/[@#$%^&*]/.test(password) ? 1 : 0);

      // Check for length constraints based on character types
      let minLength, maxLength;
      if (characterTypesCount === 2 || characterTypesCount == 1) {
        minLength = 10;
        maxLength = 20;
      } else if (characterTypesCount === 3) {
        minLength = 8;
        maxLength = 20;
      }

      // Check for overall length constraints
      const isLengthValid =
        password.length >= minLength && password.length <= maxLength;

      // Check for consecutive numbers
      const isConsecutiveValid = !/(012|123|234|345|456|567|678|789|890)/.test(
        password
      );

      // Set the overall password validity
      this.isPasswordValid = isLengthValid && isConsecutiveValid;

      // Update the error message
      this.passwordErrorMessage = this.getPasswordErrorMessage(
        minLength,
        maxLength
      );
    },

    getPasswordErrorMessage(minLength, maxLength) {
      if (this.formData.password.length < minLength) {
        return `Password must be at least ${minLength} characters long.`;
      } else if (this.formData.password.length > maxLength) {
        return `Password must be at most ${maxLength} characters long.`;
      } else if (!/^[a-zA-Z0-9!@#\$%\^&*]+$/.test(this.formData.password)) {
        return "Password can only contain letters, numbers, and special characters !@#\$%\^&*.";
      } else if (
        /(012|123|234|345|456|567|678|789|890)/.test(this.formData.password)
      ) {
        return "Consecutive numbers (012, 123, etc.) are not allowed.";
      }

      return "";
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 350px !important;
  padding: 40px;
  background-color: #f7f7f7;
  margin: 50px auto 25px;
}
.header-container {
  text-align: center;
  margin-bottom: 20px;
}

.header-container i {
  font-size: 80px;
}

.card-link {
  text-align: center;
  margin-top: 10px;
}
</style>
