
export type WorkStatus = "published" | "draft"

export type WorksMedia = {
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
    thumbnail: WorksMedia | null,
    technologyIds:string[]
    thumbnailId: string | null,
    status: WorkStatus,
    githubUrl: string | null,
    demoUrl:string | null,
    createdAt: string,
    updatedAt: string
}
