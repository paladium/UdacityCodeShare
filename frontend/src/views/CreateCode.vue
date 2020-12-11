<template>
    <div class="create-code">
        <b-card title="Add code item" v-if="createCodeForm">
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

                <b-form-file
                    v-model="codeFile"
                    :state="Boolean(codeFile)"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                    required
                ></b-form-file>

                <b-button
                    style="margin-top: 10px"
                    type="submit"
                    variant="primary"
                    >Create code</b-button
                >
            </b-form>
        </b-card>
    </div>
</template>
<script lang="ts">
import { CreateCodeItem } from "@/models/CreateCodeItem";
import Vue from "vue";
import Component from "vue-class-component";
import { v4 } from "uuid";

@Component
export default class CreateCode extends Vue {
    codeFile: File | null = null;
    mounted() {
        this.createCodeForm = <CreateCodeItem>{
            title: "",
            codeTextUrl: "",
        };
    }
    async createCode(event: any) {
        event.preventDefault();
        //We need to upload the file, first ask for the link to upload the file to, upload the file and then
        const id = v4();
        const link = await this.$store.dispatch("getCodeUploadLink", id);
        await fetch(link, {
            body: this.codeFile as any,
            method: "PUT",
        });
        this.createCodeForm!.codeTextUrl = `${id}.txt`;
        await this.$store.dispatch("createCode", this.createCodeForm);
        this.$router.push({ name: "my-codes" }, () => {
            this.$bvToast.toast(
                `The code item was successfully added. Wait for a little while, until the image is being generated`,
                {
                    title: "Added",
                    autoHideDelay: 5000,
                }
            );
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