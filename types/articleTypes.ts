import { MediaType, StatusType } from "./worksTypes"

export type Articles = {
    id:string,
    title:string,
    slug:string,
    content:string,
    categoryIds:string[],
    tagIds:string[],
    description:string,
    thumbnail: MediaType | null,
    thumbnailId: string | null,
    status: StatusType,
    publishedAt:string | null
    createdAt: string,
    updatedAt: string | null
}