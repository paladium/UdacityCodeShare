export interface User {
    sub: string
    name: string
    nickname: string
    picture: string
    updatedAt: string
    email: string
    emailVerified: boolean

    givenName?: string
    familyName?: string
    locale?: string
    [key: string]: string | boolean | undefined;
}
