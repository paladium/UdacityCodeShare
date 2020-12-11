<template>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand>CodeShare</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item @click="explore()">Explore</b-nav-item>
                <b-nav-item v-if="$auth.isAuthenticated" @click="myCodes">My codes</b-nav-item>
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto" v-if="!$auth.loading">
                <b-button @click="createCode">
                    Add code <b-icon icon="plus"/>
                </b-button>
                <b-nav-item-dropdown right v-if="$auth.isAuthenticated">
                    <template #button-content>
                        <b-avatar
                            variant="info"
                            :src="$auth.user.picture"
                        ></b-avatar>
                        {{ $auth.user.name }}
                    </template>
                    <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item v-else @click="login"> Log in </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class NavigationBar extends Vue {
    // Log the user out
    logout() {
        this.$auth.logout({
            returnTo: window.location.origin,
        });
    }
    login() {
        this.$auth.loginWithRedirect({});
    }
    myCodes(){
        this.$router.push({name: "my-codes"});
    }
    explore(){
        this.$router.push({name: "explore"});
    }
    createCode(){
        this.$router.push({name: "create-code"});
    }
}
</script>