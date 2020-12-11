import { CodesAccess } from "../dataLayer/codesAccess";
import { LikesAccess } from "../dataLayer/likesAccess";
import { S3Access } from "../dataLayer/s3";
import { CodeItem } from "../models/CodeItem";
import { CreateCodeItemRequest } from "../requests/CreateCodeItemRequest";

const uuid = require('uuid/v4');

const codeAccess = new CodesAccess();
const s3Access = new S3Access();
const likeAccess = new LikesAccess();

export async function getAllCodes(userId: string): Promise<CodeItem[]> {
    const items = await codeAccess.getAllCodes();
    //Go for each item and generate a signed url link
    for (let item of items) {
        if (item.codeUrl)
            item.codeUrl = getCodeUrl(item);
        //Check whether each item is liked by the current user
        const existingLike = await likeAccess.findLike(item.codeId, userId);
        //If count is zero, that means it is not liked yet, otherwise it is liked
        item.isLikedByCurrentUser = existingLike.Count != 0;
    }
    sortItems(items);
    return items;
}

function getCodeUrl(item: CodeItem): string {
    return s3Access.getAttachmentUrl(item.codeUrl!);
}

export async function getUserCodes(userId: string): Promise<CodeItem[]> {
    const items = await codeAccess.getUserCodes(userId);
    //Go for each item and generate a signed url link
    for (let item of items) {
        if (item.codeUrl)
            item.codeUrl = getCodeUrl(item);
    }
    sortItems(items);
    return items;
}

export async function deleteCode(id: string, userId: string) {
    const results = await codeAccess.getItemById(id);
    if (results.Count == 0) {
        throw new Error("Item not found");
    }
    const codeItem = results.Items[0] as CodeItem;
    if (codeItem.userId != userId) {
        throw new Error("The code item does not belong to the current user");
    }
    await codeAccess.deleteCodeById(id);
}

export async function createItem(createItem: CreateCodeItemRequest, userId: string): Promise<CodeItem> {
    const item = <CodeItem>{
        codeId: uuid(),
        userId: userId,
        createdAt: new Date().toISOString(),
        likes: 0,
        title: createItem.title,
        codeTextUrl: createItem.codeTextUrl,
    };
    return await codeAccess.createCode(item);
}

export async function uploadImage(image: Buffer, codeId: string) {
    const name = `${codeId}.png`;
    await s3Access.uploadImage(image, name);
    //Update the item with new attachment url
    await codeAccess.updateCodeUrl(codeId, name);
}

function sortItems(items: CodeItem[]) {
    items.sort(function (a, b) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

/*
Like unlike function will check if user already liked the code, if yes then we delete the like
Otherwise we like the code by inserting a new like
*/
export async function likeUnlikeCode(codeId: string, userId: string) {
    const existingLike = await likeAccess.findLike(codeId, userId);
    if (existingLike.Count == 0) {
        //Insert a new like
        await likeAccess.likeCode(codeId, userId);
    }
    else {
        await likeAccess.unlikeCode(codeId, userId);
    }
    const results = await codeAccess.getItemById(codeId);
    if (results.Count == 0) {
        throw new Error("Item not found");
    }
    const item = results.Items[0] as CodeItem;
    if (item.codeUrl)
        item.codeUrl = getCodeUrl(item);
    return item;
}

export async function likeCode(codeId: string) {
    await codeAccess.likeCode(codeId);
}

export async function unlikeCode(codeId: string) {
    await codeAccess.unlikeCode(codeId);
}