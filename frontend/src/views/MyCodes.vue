<template>
    <div class="my-codes">
        <h1>My codes</h1>
        <div v-for="item in codes" :key="item.codeId">
            <code-item @deleteItem="deleteCode" :myCode="true" :code="item"></code-item>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CodeItemComponent from "@/components/CodeItem.vue";
import { CodeItem } from "@/models/CodeItem";

@Component({
    components: { codeItem: CodeItemComponent },
})
export default class MyCodes extends Vue {
    mounted() {
        this.$store.dispatch("getUserCodes");
    }

    get codes() {
        return this.$store.state.userCodes as CodeItem[];
    }
    deleteCode(code: CodeItem){
        this.$store.dispatch("deleteCode", code.codeId).then(() => {
            const newCodes = this.codes.filter((item) => item.codeId != code.codeId);
            this.$store.commit("setUserCodes", newCodes);
        });
    }
}
</script>
