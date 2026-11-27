
export type StatusType = "published" | "draft"

export type MediaType = {
    id:string,
    url:string,
    fileName:string
}
export type Works = {
    id:string,
    title:string,
    slug:string,
    content:string,
    description:string,
    thumbnail: MediaType | null,
    technologyIds:string[]
    thumbnailId: string | null,
    status: StatusType,
    githubUrl: string | null,
    demoUrl:string | null,
    createdAt: string,
    updatedAt: string | null
}
