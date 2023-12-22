<!-- eslint-disable prettier/prettier -->
<template>
    <div class="register-page">
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
          @submit.prevent="handleRegister"
          novalidate
          :class="submitted ? 'was-validated' : ''"
        >
          <!-- id -->
          <div class="form-group" >
            <label for="id" style="margin-right: 10px;">ID </label>
            <div style="display: flex; align-items: baseline;">
              <input
              type="number"
              v-model="formData.customer_id"
              class="form-control"
              name="customer_id"
              id="customer_id"
              placeholder="Customer Id"
              min="999"
              required
              @input="validateId"
              style="flex: 1; margin-right: 10px;"
              
              
            />
            <button  class="btn btn-warning" @click="handleCheckDuplicate">Check duplicate</button>
            
            
            </div>
            <div
              class="invalid-feedback"
              :style="{ display: isIdValid ? 'none' : 'block' }"
            >
              ID must be at least 4 digits long.
            </div>
          </div>
          <!-- password -->
  
          <div class="form-group">
            <label for="password">Passwords </label>
            <input
              type="password"
              v-model="formData.password"
              class="form-control"
              name="password"
              id="password"
              placeholder="Password"
              required
              />
              <!-- @input="validatePassword" -->
            <div
              class="invalid-feedback"
              :style="{ display: isPasswordValid ? 'none' : 'block' }"
            >
              <!-- {{ getPasswordErrorMessage() }} -->
              
            </div>
          </div>
          <!-- reconfirm password -->
          <div class="form-group">
            <label for="repassword">Reconfirm your password </label>
            <input
              type="password"
              v-model="formData.repassword"
              class="form-control"
              name="repassword"
              id="repassword"
              placeholder="Password"
              required
            />
            <div class="invalid-feedback">
              Reconfirm Password is required.
            </div>
          </div>
          <!-- name -->
          <div class="form-group">
            <label for="name">Name </label>
            <input
              type="text"
              v-model="formData.name"
              class="form-control"
              name="name"
              id="name"
              placeholder="Name"
              pattern="[A-Za-z ]+"
              title="Name must only contain letters."
              required
              @input="validateName"
            />
            <div
              class="invalid-feedback"
              :style="{ display: isNameValid ? 'none' : 'block' }"
            >
              Name is required and must only contain letters.
            </div>
          </div>
          <!-- mobile phone -->
          <div class="form-group">
            <label for="phone_number">Mobile phone</label>
            <div class="block">
              <div class="d-flex">
                <input
                  type="text"
                  v-model="formData.phone_number_part1"
                  class="form-control"
                  name="phone_number_part1"
                  id="phone_number_part1"
                  placeholder="0123"
                  required
                  pattern="[0-9]{4}"
                  style="width: 40%;"
                  @input="validatePhoneNumber"
                />
  
                <span style="margin: 6px 5px;">-</span>
                <input
                  type="text"
                  v-model="formData.phone_number_part2"
                  class="form-control"
                  name="phone_number_part2"
                  id="phone_number_part2"
                  placeholder="456"
                  required
                  pattern="[0-9]{3}"
                  style="width: 30%;"
                  @input="validatePhoneNumber"
                />
                <span style="margin: 6px 5px;">-</span>
                <input
                  type="text"
                  v-model="formData.phone_number_part3"
                  class="form-control"
                  name="phone_number_part3"
                  id="phone_number_part3"
                  placeholder="789"
                  required
                  pattern="[0-9]{3}"
                  style="width: 30%;"
                  @input="validatePhoneNumber"
                />
              </div>
              <div
                class="invalid-feedback"
                :style="{ display: isPhoneNumberValid ? 'none' : 'block' }"
              >
                Phone number is required and must only contain letters.
              </div>
            </div>
          </div>
          <!-- email -->
          <div class="form-group">
            <label for="phone_number">Email</label>
            <div class="d-flex">
              <input
                type="text"
                class="form-control mb-2 "
                v-model="formData.emailPart1"
                style="width: 40%;"
                id="emailPart1"
                
              />
  
              <div class="input-group mb-2 ml-4 " style="width: 54%;">
                <select
                  class="custom-select "
                  v-model="formData.emailPart2"
                  id="emailPart2"
                >
                  <option selected> Choose email domain</option>
                  <option value="@naver.com">@naver.com</option>
                  <option value="@daum.net">@daum.net</option>
                  <option value="@gmail.com">@gmail.com</option>
                  <option value="@nate.com">@nate.com</option>
                  <option value="@hotmail.com">@hotmail.com</option>
                </select>
              </div>
            </div>
          </div>
  
          <button
            class="btn btn-primary btn-block"
            @click="submitted = true"
            :disabled="loading"
          >
            Sign Up
          </button>
        </form>
  
        <a href="/login" class="card-link">I have an Account!</a>
      </div>
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import UserService from "../services/user.service";
  import User from "../models/user";
  import vuex from "vuex";
  /* eslint-disable */
  export default {
    name: "register",
    data() {
      return {
        formData: new User(),
        loading: false,
        submitted: false,
        successMessage: "",
        errorMessage: "",
        isDuplicateId: false,
        isIdValid: true,
        isPasswordValid: true,
        isNameValid: true,
        isPhoneNumberValid: true,
        isEmailValid: true,
      };
    },
    computed: {
      ...vuex.mapGetters(["user", "loginResponse"]),
    },
    mounted() {
      if (this.user && this.user.username) {
        this.$router.push("/login");
      }
    },
    methods: {
      ...vuex.mapActions(["updateUser", "loginResponse"]),
      async handleCheckDuplicate() {
        try {
          const response = await UserService.checkDuplicate(this.formData.customer_id);
          console.log("🚀 ~ file: Register.vue:237 ~ handleCheckDuplicate ~ response:", response)
          this.successMessage = "ID Member valid";
            
        } catch (error) {
          
          if (!error.response) {
            this.errorMessage =
              "Duplicate ID Member : " 
          } else if (error.response.status === 409) {
            this.errorMessage = "Username is not valid.";
          } else {
            this.errorMessage =
            "Duplicate ID Member " 
          }
        } finally {
          this.loading = false;
        }
      },
      validateId() {
        // Check if ID is at least 4 digits long
        this.isIdValid = /^[0-9]{4,}$/.test(this.formData.customer_id);
  
        // Check for duplicate ID (you should implement this logic)
        // For now, let's assume a method called checkDuplicateId is used
        this.isDuplicateId = this.checkDuplicateId(this.formData.customer_id);
      },
  
      // validatePassword() {
      //   const enteredPassword = this.formData.password;
  
      //   // Check if enteredPassword satisfies the specified conditions
      //   const isEnglishCaseSensitive = /^(?=.*[a-z])(?=.*[A-Z])/.test(enteredPassword);
      //   const isLengthValid =
      //     (/(?=.{10,20}$)/.test(enteredPassword) &&
      //       !/(?:(\d)\1\1)/.test(enteredPassword)) ||
      //     /(?=.{8,20}$)/.test(enteredPassword);
      //   const isSpecialCharacterValid = /^[!@#\$%^&*]+$/.test(enteredPassword);
  
      //   // Set isPasswordValid based on the combination of conditions
      //   this.isPasswordValid =
      //     isEnglishCaseSensitive && isLengthValid && isSpecialCharacterValid;
      // },
      // getPasswordErrorMessage() {
      //   if (!this.isPasswordValid) {
      //     if (!/^(?=.*[a-z])/.test(this.formData.password)) {
      //       return "Password must contain at least one lowercase letter.";
      //     }
      //     if (!/^(?=.*[A-Z])/.test(this.formData.password)) {
      //       return "Password must contain at least one uppercase letter.";
      //     }
      //     if (!/(?:(\d)\1\1)/.test(this.formData.password)) {
      //       return "Consecutive numbers must not be more than 3 characters.";
      //     }
      //     if (!/^[!@#\$%\^&*]+$/.test(this.formData.password)) {
      //       return "Allowed special characters are !@#$%^&*.";
      //     }
      //     return "Password must satisfy the specified conditions.";
      //   }
      //   return "";
      // },
      validateName() {
        // Check if name contains only letters
        const enteredText = this.formData.name;
  
        // Check if enteredText contains only letters
        this.isNameValid = /^[A-Za-z ]+$/.test(enteredText);
      },
  
      validatePhoneNumber() {
        const part1 = this.formData.phone_number_part1;
        const part2 = this.formData.phone_number_part2;
        const part3 = this.formData.phone_number_part3;
  
        // Check if each part is a number
        const isPart1Valid = /^\d{4}$/.test(part1) && part1.length < 5;
        const isPart2Valid = /^\d{3}$/.test(part2) && part2.length < 4;
        const isPart3Valid = /^\d{3}$/.test(part3) && part3.length < 4;
  
        // Check if all parts are valid
        this.isPhoneNumberValid = isPart1Valid && isPart2Valid && isPart3Valid;
      },
      async handleRegister() {
        // check password and repassword
        if (this.formData.password !== this.formData.repassword) {
          this.errorMessage = "Passwords do not match.";
          return;
        }
  
        // Clear error message if there was a previous mismatch
        this.errorMessage = "";
  
        const storedResponse = JSON.parse(localStorage.getItem("response"));
  
        // Build the payload with only the desired fields
        const payload = {
          customerId: this.formData.customer_id,
          password: this.formData.password,
          name: this.formData.name,
          email: `${this.formData.emailPart1}${this.formData.emailPart2}`,
          phoneNumber: `${this.formData.phone_number_part1}${this.formData.phone_number_part2}${this.formData.phone_number_part3}`,
        };
  
        console.log("payload =========@@@@@@", payload);
  
        if (
          !payload.customerId ||
          !payload.email ||
          !payload.name ||
          !payload.password ||
          !payload.phoneNumber
        ) {
          return;
        }
        this.loading = true;
        try {
          const response = await UserService.register(payload, storedResponse);
          console.log("register =+++++++++++++");
            console.log("response", response);
            this.$router.push('/login');
        } catch (error) {
          console.log(error);
          if (!error.response) {
            this.errorMessage =
              "Unexpected error occurred : " +
              ((error && error.errorMessage) || error);
          } else if (error.response.status === 409) {
            this.errorMessage = "Username is not valid.";
          } else {
            this.errorMessage =
              "Unexpected error occurred : " +
              ((error && error.errorMessage) || error);
          }
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .card {
    max-width: 500px !important;
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
  