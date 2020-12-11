<template>
    <div class="home">
        <h1>Explore other people's codes</h1>
        <div v-for="item in allCodes" :key="item.codeId">
            <code-item
                @like="likeUnlikeCode($event, true)"
                @unlike="likeUnlikeCode($event, false)"
                :code="item"
            ></code-item>
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
export default class Explore extends Vue {
    mounted() {
        if (this.$store.state.accessToken == "") {
            this.$store.subscribe((mutation) => {
                if (mutation.type == "setAccessToken") {
                    this.$store.dispatch("getAllCodes");
                }
            });
        } else {
            this.$store.dispatch("getAllCodes");
        }
    }

    get allCodes() {
        return this.$store.state.allCodes as CodeItem[];
    }
    likeUnlikeCode(code: CodeItem, willBeLiked = false) {
        this.$store.dispatch("likeUnlikeCode", code.codeId).then((item) => {
            //Replace the item with new updated item
            let existingItem = this.allCodes.find(
                (a) => a.codeId == code.codeId
            );
            if (existingItem) {
                if (willBeLiked) {
                    existingItem.likes++;
                    existingItem.isLikedByCurrentUser = true;
                } else {
                    existingItem.likes--;
                    existingItem.isLikedByCurrentUser = false;
                }
            }
        });
    }
}
</script>
