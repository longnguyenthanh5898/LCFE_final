<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<template>
    <div class="jumbotron">
        <h1 class="display-4">Hello, {{user.name}}!</h1>
        <p class="lead">
            This is a simple fancy user management application that is created with Spring Boot, MySQL and Vue JS.
        </p>
        <hr class="my-4"/>
        <p>Your current role is <strong>{{user.role}}</strong>
            If you want to change it, you can use below button.
        </p>
        <button class="btn btn-primary" @click="changeRole"> Change Role </button>
    </div>
</template>

<script>
/* eslint-disable */
    import UserService from '../services/user.service';
    import Role from '../models/role';
    import vuex from 'vuex';

    export default {
        name: 'profile',
        computed: {
            ...vuex.mapGetters(['user']),
        },
        methods: {
            ...vuex.mapActions(['updateUser']),
            changeRole() {
                const newRole = this.user.role === Role.ADMIN ? Role.USER : Role.ADMIN;
                UserService.changeRole(this.user.username, newRole)
                    .then((response) => {
                        const u = this.user;
                        u.role = response.data.role;
                        this.updateUser(u);
                    });
            },
        },
    };
</script>

<style scoped>

</style>
