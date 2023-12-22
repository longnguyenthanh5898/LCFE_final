<!-- eslint-disable prettier/prettier -->
<template>
    <div class="login-page">
        <div class="card">
            <div class="header-container">
                <i class="fa fa-user"/>
            </div>
            <div v-if="errorMessage"
                 class="alert alert-danger"
                 role="alert">
                {{errorMessage}}
            </div>
            <div v-if="successMessage"
                 class="alert alert-success"
                 role="alert">
                {{successMessage}}
            </div>
            <form name="form" @submit.prevent="handleLogin"
                  novalidate
                  :class="submitted ? 'was-validated' : ''">
        
                <div class="form-group">
                    <label for="userId"> Member Id</label>
                    <input type="number"
                           v-model="formData.customer_id"
                           class="form-control"
                           name="customer_id"
                           id="customer_id"
                           placeholder="Member Id"
                           required />
                    <div class="invalid-feedback">
                        Password is required.
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Password </label>
                    <input type="password"
                           v-model="formData.password"
                           class="form-control"
                           name="password"
                           id="password"
                           placeholder="Password"
                           required />
                    <div class="invalid-feedback">
                        Password is required.
                    </div>
                </div>

                <button
                        class="btn btn-primary btn-block"
                        @click="submitted = true"
                        :disabled="loading">
                    Login
                </button>
            </form>

            <a href="/register" class="card-link">Create New Account!</a>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
    import UserService from '../services/user.service';
    import User from '../models/user';
    import vuex from 'vuex';

    export default {
        name: 'login',
        data() {
            return {
                formData: new User('', ''),
                loading: false,
                submitted: false,
                errorMessage: '',
                successMessage: ''
            };
        },
        computed: {
            ...vuex.mapGetters(['user', 'loginResponse']),
        },
        mounted() {
            if (this.user && this.user.customer_id) {
                this.$router.push('/home');
            }
        },
        methods: {
            ...vuex.mapActions(['updateUser', 'saveLoginResponse']),
         
            async handleLogin() {
    if (!this.formData.customer_id || !this.formData.password) {
        return;
    }
    this.loading = true;
    try {
        const response = await UserService.login(this.formData);
        // Store pure password for further operations.
        this.saveLoginResponse(response.data)
        
        this.successMessage = "Login successfully !"
        setTimeout(() => {
            this.$router.push('/home');
            
        }, 1000)
    } catch (error) {
        console.log(error);
        this.errorMessage = "MemberID or password is valid";
    } finally {
        this.loading = false;
    }
}

        }
    };
</script>

<style scoped>
    .card {
        max-width: 350px!important;
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
