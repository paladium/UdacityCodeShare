export interface CodeItem{
    userId: string;
    codeId: string;
    createdAt: string;
    codeTextUrl: string;
    codeUrl?: string;
    title: string;
    likes: number;
    isLikedByCurrentUser?: boolean;
}