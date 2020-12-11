<template>
    <div class="code-item">
        <b-card
            border-variant="secondary"
            :header="code.title"
            header-border-variant="secondary"
            align="center"
            :img-src="code.codeUrl"
        >
                <template v-if="!myCode">
                    <b-button :disabled="!$auth.isAuthenticated" @click="like"
                        >{{ code.likes }} <b-icon icon="star"
                    /></b-button>
                </template>
                <template v-else>
                    <b-button variant="danger" @click="deleteItem"> Delete </b-button>
                </template>
        </b-card>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export default class CodeItem extends Vue {
    @Prop()
    code!: CodeItem;

    @Prop({ default: false })
    myCode!: boolean;

    like() {
        this.$emit("like", this.code);
    }
    deleteItem(){
        this.$emit("deleteItem", this.code);
    }
}
</script>
<style>
.code-item {
    margin-top: 20px;
    margin-bottom: 20px;
}
</style>