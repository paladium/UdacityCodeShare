<template>
    <div class="create-code">
        <b-card title="Add code item">
            <b-form @submit="createCode">
                <b-form-group
                    id="input-group-1"
                    label="Code title:"
                    label-for="input-1"
                >
                    <b-form-input
                        id="input-1"
                        v-model="createCodeForm.title"
                        required
                        placeholder="Enter title"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    id="input-group-2"
                    label="Code:"
                    label-for="input-2"
                >
                    <b-textarea
                        id="input-2"
                        v-model="createCodeForm.code"
                        required
                        placeholder="Enter code"
                    >
                    </b-textarea>
                </b-form-group>

                <b-button type="submit" variant="primary">Create code</b-button>
            </b-form>
        </b-card>
    </div>
</template>
<script lang="ts">
import { CreateCodeItem } from "@/models/CreateCodeItem";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class CreateCode extends Vue {
    mounted() {
        this.createCodeForm = <CreateCodeItem>{
            title: "",
            code: "",
        };
    }
    createCode(event: any) {
        event.preventDefault();
        this.$store.dispatch("createCode", this.createCodeForm).then(() => {
            this.$bvToast.toast(`The code item was successfully added. Wait for a little while, until the image is being generated`, {
                title: "Added",
                autoHideDelay: 2000,
            });
            this.$router.push({ name: "my-codes" });
        });
    }

    get createCodeForm(): CreateCodeItem | null {
        return this.$store.state.createCode;
    }
    set createCodeForm(value: CreateCodeItem | null) {
        this.$store.commit("setCreateCode", value);
    }
}
</script>