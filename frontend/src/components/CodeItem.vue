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
                <b-button :disabled="!$auth.isAuthenticated" @click="likeUnlike"
                    >{{ code.likes }}
                    <b-icon
                        :icon="
                            code.isLikedByCurrentUser ? 'star-fill' : 'star'
                        "
                /></b-button>
            </template>
            <template v-else>
                <b-button variant="danger" @click="deleteItem">
                    Delete
                </b-button>
            </template>
        </b-card>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { CodeItem } from "@/models/CodeItem";

@Component
export default class CodeItemComponent extends Vue {
    @Prop()
    code!: CodeItem;

    @Prop({ default: false })
    myCode!: boolean;

    likeUnlike() {
        if (this.code.isLikedByCurrentUser) {
            this.$emit("unlike", this.code);
        } else {
            this.$emit("like", this.code);
        }
    }
    deleteItem() {
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