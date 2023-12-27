<!-- eslint-disable prettier/prettier -->
<template>
    <div style="padding-top: 30px;">
      <div v-if="infoMessage" class="alert alert-success" role="alert">
        {{ infoMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <!-- search -->
      <form
        @submit.prevent="handleSearch"
        novalidate
        :class="submitted ? 'was-validated' : ''"
        name="form"
      >
        <div class="row">
          <!-- id -->
          <!-- /*Break to component common*/ -->
          <div class="form-group col-6 col-md-6 col-sm-12">
            <label for="id">ID</label>
            <input
              type="number"
              class="form-control"
              id="customer_id"
              v-model="searchForm.customer_id"
              placeholder="Customer Id"
            />
          </div>
          <!-- mobile -->
          <div class="form-group col-6 col-md-6 col-sm-12">
            <label for="phone_number">Mobile phone</label>
            <div class="block">
              <div class="d-flex">
                <input
                  type="text"
                  v-model="searchForm.phone_number_part1"
                  class="form-control"
                  name="phone_number_part1"
                  id="phone_number_part1"
                  placeholder="0123"
                  pattern="[0-9]{4}"
                  style="width: 40%;"
                />
  
                <span style="margin: 6px 5px;">-</span>
                <input
                  type="text"
                  v-model="searchForm.phone_number_part2"
                  class="form-control"
                  name="phone_number_part2"
                  id="phone_number_part2"
                  placeholder="456"
                  pattern="[0-9]{3}"
                  style="width: 30%;"
                />
                <span style="margin: 6px 5px;">-</span>
                <input
                  type="text"
                  v-model="searchForm.phone_number_part3"
                  class="form-control"
                  name="phone_number_part3"
                  id="phone_number_part3"
                  placeholder="789"
                  pattern="[0-9]{3}"
                  style="width: 30%;"
                />
              </div>
            </div>
          </div>
  
          <!-- name -->
          <!-- /*Break to component common form field*/ -->
          <div class="form-group col-6 col-md-6 col-sm-12">
            <label for="name">Name</label>
            <input
              type="text"
              v-model="searchForm.name"
              class="form-control"
              name="name"
              id="name"
              placeholder="Name"
              pattern="[A-Za-z ]+"
              title="Name must only contain letters."
            />
          </div>
          <div class="form-group col-6 col-md-6 col-sm-12">
            <label for="date" class="col-12">Join Date - End Date</label>
  
            <date-picker
              v-model="searchForm.rangeTime"
              id="rangeTime"
              range
              format="DD/MM/YYYY"
              class="col-12"
              @input="updateDateRange"
            ></date-picker>
          </div>
  
          <div class="form-group col-12 d-flex justify-content-end">
            <button type="submit" class="btn btn-primary">Search</button>
            <button
              type="button"
              class="btn btn-secondary mx-2"
              @click="clearForm"
            >
              Clear
            </button>
            <button
              type="button"
              class="btn btn-success mx-2"
              @click="exportToExcel"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </form>
  
      <!-- table -->
      <!-- /*Break to component common table*/ -->
      <div class="card">
        <div class="card-header">
          
            <h5 >Total {{ userList.totalElements }} members</h5>
         
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">MemberNo</th>
                <th scope="col">ID</th>
  
                <th scope="col">Name</th>
                <th scope="col">Mobile phone</th>
                <th scope="col">Email</th>
                <th scope="col">Join Date</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, ind) in userList.resource" :key="ind">
                <th scope="row">{{ (userList.page - 1) * 5 + ind + 1 }}</th>
                <td>{{ user.customerId }}</td>
  
                <td>{{ user.name }}</td>
                <td>{{ user.phoneNumber }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.createdDate.match(/^(\d{2}\/\d{2}\/\d{4})/)[1] }}</td>
                <td>
                  <div class="d-flex">
                    <button
                      type="button"
                      class="btn btn-warning"
                      data-toggle="modal"
                      data-target="#formEdit"
                      @click="openEditModal(user)"
                   
                    >
                      Edit
                    </button>
  
                    <!-- modal edit -->
                    <!-- /*Break to component common modal*/ -->
                    <div
                      class="modal fade"
                      id="formEdit"
                      tabindex="-1"
                      role="dialog"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                      :class="{ display: isModalOpen ? 'block' : 'none'}"
                    >
                      <div
                        class="modal-dialog modal-dialog-centered"
                        role="document"
                        :style="{
                          display: isModalOpen ? 'block' : 'none',
                        }"
                      >
                        <div class="modal-content">
                          <div class="modal-header border-bottom-0">
                            <h5 class="modal-title" id="exampleModalLabel">
                              Edit User
                            </h5>
                            <button
                              type="button"
                              class="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <form
                            name="formEdit"
                            @submit.prevent="submitEditForm"
                            novalidate
                            :class="submitted ? 'was-validated' : ''"
                          >
                            <div class="modal-body">
                              <!-- id -->
                              <div class="form-group">
                                <label for="id">ID </label>
                                <input
                                  type="number"
                                  class="form-control"
                                  name="customer_id"
                                  id="customer_id"
                                  placeholder="Customer Id"
                                  disabled
                                  v-model="editUserData.customerId"
                                />
                              </div>
                              <!-- name -->
                              <div class="form-group">
                                <label for="name">Name </label>
                                <input
                                  type="text"
                                  class="form-control"
                                  name="name"
                                  id="name"
                                  placeholder="Name"
                                  pattern="[A-Za-z ]+"
                                  title="Name must only contain letters."
                                  required
                                  @input="validateName"
                                  v-model="editUserData.name"
                                />
                                <div
                                  class="invalid-feedback"
                                  :style="{
                                    display: isNameValid ? 'none' : 'block',
                                  }"
                                >
                                  Name is required and must only contain letters.
                                </div>
                                <!-- password -->
  
                                <div class="form-group">
                                  <label for="password">Passwords </label>
                                  <input
                                    type="password"
                                    class="form-control"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    required
                                    v-model="editUserData.password"
                                  />
                                  <!-- @input="validatePassword" -->
                                  <div
                                    class="invalid-feedback"
                                    :style="{
                                      display: isPasswordValid ? 'none' : 'block',
                                    }"
                                  >
                                    <!-- {{ getPasswordErrorMessage() }} -->
                                  </div>
                                </div>
                                <!-- reconfirm password -->
                               
                              </div>
                              <!-- mobile phone -->
                              <div class="form-group">
                                <label for="phone_number">Mobile phone</label>
                                <div class="block">
                                  <div class="d-flex">
                                    <input
                                      type="text"
                                      class="form-control"
                                      name="phone_number_part1"
                                      id="phone_number_part1"
                                      placeholder="0123"
                                      required
                                      pattern="[0-9]{4}"
                                      style="width: 40%;"
                                      @input="validatePhoneNumber"
                                      v-model="editUserData.phone_number_part1"
                                    />
  
                                    <span style="margin: 6px 5px;">-</span>
                                  <input
                                    type="text"
                                    class="form-control"
                                    name="phone_number_part2"
                                    id="phone_number_part2"
                                    placeholder="456"
                                    required
                                    pattern="[0-9]{3}"
                                    style="width: 30%;"
                                    @input="validatePhoneNumber"
                                    v-model="editUserData.phone_number_part2"
                                  />
                                  <span style="margin: 6px 5px;">-</span>
                                  <input
                                    type="text"
                                    class="form-control"
                                    name="phone_number_part3"
                                    id="phone_number_part3"
                                    placeholder="789"
                                    required
                                    pattern="[0-9]{3}"
                                    style="width: 30%;"
                                    @input="validatePhoneNumber"
                                    v-model="editUserData.phone_number_part3"
                                  />
                                  </div>
                                  <div
                                    class="invalid-feedback"
                                    :style="{
                                      display: isPhoneNumberValid
                                        ? 'none'
                                        : 'block',
                                    }"
                                  >
                                    Phone number is required and must only contain
                                    letters.
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
                                    style="width: 40%;"
                                    id="emailPart1"
                                    placeholder="Jane Doe"
                                    v-model="editUserData.emailPart1"
                                  />
  
                                  <div
                                  class="input-group mb-2 ml-4 "
                                  style="width: 54%;"
                                  
                                >
                                  <select class="custom-select " id="emailPart2" v-model="editUserData.emailPart2">
                                    <option selected
                                      > Choose email domain</option
                                    >
                                    <option value="@naver.com">@naver.com</option>
                                    <option value="@daum.net">@daum.net</option>
                                    <option value="@gmail.com">@gmail.com</option>
                                    <option value="@nate.com">@nate.com</option>
                                    <option value="@hotmail.com"
                                      >@hotmail.com</option
                                    >
                                  </select>
                                </div>
                                </div>
                              </div>
  
                              <!-- join date -->
                              <div class="form-group">
                                <label for="phoneNumber">Join Date</label>
                                <input
                                  type="text"
                                  class="form-control"
                                  id="phoneNumber"
                                  disabled
                                  placeholder="0123456789"
                                  v-model="editUserData.createdDateFixed"
                                />
                              </div>
                            </div>
                            <div
                              class="modal-footer border-top-0 d-flex justify-content-center"
                            >
                              <button type="submit" class="btn btn-success" >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <button
                      class="btn btn-danger mx-2"
                      :disabled="user.role === 'ROLE_USER'"
                      @click="deleteUser(user.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- modal -->
      <!-- Button trigger modal -->
  
      <!-- Modal -->
  
      <!-- pagination -->
      <!-- /*Break to component common*/ -->
      <nav aria-label="Page navigation ">
        <ul class="pagination d-flex justify-content-center mt-2">
          <li class="page-item" :class="{ disabled: userList.page === 1 }">
            <a
              class="page-link"
              @click.prevent="loadPage(userList.page - 1)"
              href="#"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
  
          <li
            v-for="pageNumber in userList.totalPages"
            :key="pageNumber"
            class="page-item"
            :class="{ active: pageNumber === userList.page }"
          >
            <a class="page-link" @click.prevent="loadPage(pageNumber)" href="#">
              {{ pageNumber }}
            </a>
          </li>
  
          <li
            class="page-item"
            :class="{ disabled: userList.page === userList.totalPages }"
          >
            <a
              class="page-link"
              @click.prevent="loadPage(userList.page + 1)"
              href="#"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
  
         
        </ul>
      </nav>
      <!-- /*Break to component common*/ -->
    </div>
  </template>
  
  <script>
  /* eslint-disable */
  import UserService from "../services/user.service";
  import User from "../models/user";
  import "vue-datepicker-ui/lib/vuedatepickerui.css";
  import DatePicker from "vue2-datepicker";
  import "vue2-datepicker/index.css";
  import moment from "moment";
  
  
  export default {
    components: { DatePicker },
    name: "home",
    data() {
      return {
        editUserData: {},
        userList: {
          page: 1,
          resource: [],
          totalElements: 0,
          totalPages: 0,
        },
        searchPayload: {},
        errorMessage: "",
        infoMessage: "",
        searchForm: new User(),
        isIdValid: true,
        isPasswordValid: true,
        isNameValid: true,
        isPhoneNumberValid: true,
        isEmailValid: true,
        time3: null,
        submitted: false,
        isModalOpen: false,
        idUser: ''
      };
    },
    methods: {
      async submitEditForm() {
       
        const storedResponse = JSON.parse(localStorage.getItem("response"));
        const user = this.editUserData
        const payloadEdit = {
          ...user,
          email: `${user.emailPart1}${user.emailPart2}`,
          phoneNumber: user.phone_number_part1 + user.phone_number_part2 + user.phone_number_part3,
          createdDate: user.createdDate
        }
  
        try {
          const response = await UserService.editMember(
            payloadEdit,
            storedResponse
          );
          console.log("response", response);
          location.reload()
        } catch (error) {
          console.log(error);
          if (!error.response) {
            location.reload()
            this.errorMessage =
              "Unexpected error occurred : " +
              ((error && error.errorMessage) || error);
          } else if (error.response.status === 409) {
            location.reload()
            this.errorMessage = "Username is not valid.";
          } else if (error.response.status === 403) {
            location.reload()
            this.errorMessage = "No permission to edit";
            } else {
              location.reload()
            this.errorMessage =
              "Unexpected error occurred : " +
              ((error && error.errorMessage) || error);
          }
        } finally {
          this.loading = false;
        }
        this.isModalOpen = false;
  
      
      },
      openEditModal(user) {
        console.log("🚀 ~ file: Home.vue:522 ~ openEditModal ~ user:", user.createdDate.slice(0, 10))
        const emailFull = user.email
        const [emailPart1, emailPart2] = emailFull.split('@')
        const phone_number_part1 = user.phoneNumber.slice(0, 4)
        const phone_number_part2 = user.phoneNumber.slice(4,7)
        const phone_number_part3 = user.phoneNumber.slice(7)
       
        const payloadEdit = {
          ...user,
          createdDateFixed: user.createdDate.slice(0, 10),
          emailPart1,
          emailPart2: `@${emailPart2}`,
          phone_number_part1, phone_number_part2, phone_number_part3
  
  
        }
        console.log("🚀 ~ file: Home.vue:530 ~ openEditModal ~ payloadEdit:", payloadEdit)
        
        this.isModalOpen = true;
    
        this.editUserData = payloadEdit;
      },
  
      updateDateRange(selectedRange) {
        // Update searchForm.rangeTime when the user selects a date range
        this.searchForm.rangeTime = selectedRange;
      },
      clearForm() {
        this.searchForm.customer_id = null;
        this.searchForm.phone_number_part1 = null;
        this.searchForm.phone_number_part2 = null;
        this.searchForm.phone_number_part3 = null;
        this.searchForm.name = null;
        this.searchForm.rangeTime = null;
  
        this.isIdValid = true;
        this.isPhoneNumberValid = true;
        this.isNameValid = true;
  
        this.errorMessage = "";
        this.infoMessage = "";
  
        this.submitted = false;
        this.loadPage(1);
      },
      async deleteUser(id) {
      
        const storedResponse = JSON.parse(localStorage.getItem("response"));
  
        try {
          const response = await UserService.deleteMember(id, storedResponse);
          console.log("response", response);
          this.loadPage(1);
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
      updateUser() {
        alert("edit");
        // const token = JSON.parse(localStorage.getItem("response"));
      },
  
      async handleSearch() {
        this.submitted = true;
  
        const storedResponse = JSON.parse(localStorage.getItem("response"));
       
        const {
          customer_id: customerId,
          name,
          phone_number_part1,
          phone_number_part2,
          phone_number_part3,
        } = this.searchForm;
  
        const startDate =
          this.searchForm.rangeTime && this.searchForm.rangeTime.length > 0
            ? moment(this.searchForm.rangeTime[0]).format("DD/MM/YYYY")
            : null;
  
        const endDate =
          this.searchForm.rangeTime && this.searchForm.rangeTime.length > 1
            ? moment(this.searchForm.rangeTime[1]).format("DD/MM/YYYY")
            : null;
        let payload = {};
  
        if (customerId != null) {
          payload.customerId = customerId;
        }
  
        if (name != null) {
          payload.name = name;
        }

        /*should use operator !==*/
  
        if (
          phone_number_part1 != null ||
          phone_number_part2 != null ||
          phone_number_part3 != null
        ) {
          /*Syntax phone_number_part1 ? phone_number_part1 : ''*/
          payload.phoneNumber = `${phone_number_part1 ||
            ""}${phone_number_part2 || ""}${phone_number_part3 || ""}`;
        }

        /*should use operator !==*/
  
        if (startDate != null) {
          payload.startDate = startDate;
        }
  
        if (endDate != null) {
          payload.endDate = endDate;
        }
        this.searchPayload = payload;
  
        const isPayloadEmpty = Object.keys(payload).length === 0;
  
        try {
          let response;
  
          if (!isPayloadEmpty && storedResponse) {
            response = await UserService.searchMember(payload, storedResponse);
            /*remove console.log*/
            console.log(
              "🚀 ~ file: Home.vue:384 ~ handleSearch ~ response",
              response
            );
          } else {
            response = await UserService.findAllUsers(storedResponse, 1);
            console.log(
              "🚀 ~ file: Home.vue:389 ~ handleSearch ~ ",
              response
            );
          }
  
          this.userList = response.data;
          /*remove console.log*/
          console.log("response", response);
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
  
      async exportToExcel() {
        const storedResponse = JSON.parse(localStorage.getItem("response"));
  
        try {
          const response = await UserService.exportExcel(
            this.searchPayload,
            storedResponse
          );
          /*remove console.log*/
          console.log("response", response);
          if (response.data) {
            this.handleExcelExport(response.data);
          } else {
            this.errorMessage = "No Excel file data found in the API response.";
          }
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
  
      handleExcelExport(data) {
        console.log("dataExcel", data);
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "Members.xlsx";
        document.body.appendChild(link);
        link.click();
      },
  
      validateId() {
        // Check if ID is at least 4 digits long
        this.isIdValid = /^[0-9]{4,}$/.test(this.searchForm.customer_id);
  
        // this.isDuplicateId = this.checkDuplicateId(this.searchForm.customer_id);
      },
      validateName() {
        // Check if name contains only letters
        const enteredText = this.searchForm.name;
  
        // Check if enteredText contains only letters
        this.isNameValid = /^[A-Za-z ]+$/.test(enteredText);
      },
  
      validatePhoneNumber() {
        const part1 = this.searchForm.phone_number_part1;
        const part2 = this.searchForm.phone_number_part2;
        const part3 = this.searchForm.phone_number_part3;
  
        // Check if each part is a number
        const isPart1Valid = /^\d{4}$/.test(part1) && part1.length < 5;
        const isPart2Valid = /^\d{3}$/.test(part2) && part2.length < 4;
        const isPart3Valid = /^\d{3}$/.test(part3) && part3.length < 4;
  
        // Check if all parts are valid
        this.isPhoneNumberValid = isPart1Valid && isPart2Valid && isPart3Valid;
      },
      async loadPage(page) {
        const token = JSON.parse(localStorage.getItem("response"));
        this.idUser = token.split('-')[0]
        console.log("AAAAAAAAAAAAAAAAAAAAA", this.idUser)
        if (token) {
          try {
            UserService.findAllUsers(token, page).then((response) => {
              this.userList = response.data;
              console.log(
                "🚀 ~ file: Home.vue:168 ~ UserService.findAllUsers ~ userList:",
                this.userList
              );
            });
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
        }
      },
    },
  
    mounted() {
      this.loadPage(1);
    },
  };
  </script>
  
  <style>
  .mx-datepicker-range {
    width: 100% !important;
  }
  .mx-input {
    padding: 18px 10px !important;
    width: 540px !important;
  }
  .mx-datepicker{
    margin-left: -16px !important;
      width: 460px !important;
  
  }
  .mx-icon-calendar{
    right: -80px;
  }
  
  </style>
  