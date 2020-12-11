<template>
    <div id="app">
        <navigation-bar></navigation-bar>
        <b-container>
            <router-view />
        </b-container>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import NavigationBar from "@/components/NavigationBar.vue";

@Component({
    components: { NavigationBar },
})
export default class App extends Vue {
    mounted() {
        this.$auth.$watch("loading", () => {
            this.$auth.getIdTokenClaims({})?.then((claims) => {
                if (claims) {
                    this.$store.commit("setAccessToken", claims.__raw);
                }
            });
        });
    }
}
</script>

<style lang="scss">
#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>
