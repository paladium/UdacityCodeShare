<template>
    <div class="home">
        <div v-for="item in allCodes" :key="item.codeId">
            <code-item @like="likeCode" :code="item"></code-item>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CodeItemComponent from '@/components/CodeItem.vue';
import { CodeItem } from "@/models/CodeItem";

@Component({
    components: {"codeItem": CodeItemComponent},
})
export default class Explore extends Vue {


    mounted() {
        this.$store.dispatch("getAllCodes");
    }

    get allCodes(){
        return this.$store.state.allCodes as CodeItem[];
    }
    likeCode(code: CodeItem){
        this.$store.dispatch("likeCode", code.codeId).then((item) => {
            //Replace the item with new updated item
            let existingItem = this.allCodes.find((a) => a.codeId == code.codeId);
            if(existingItem){
                existingItem.likes = item.likes;
            }
        });
    }
}
</script>
