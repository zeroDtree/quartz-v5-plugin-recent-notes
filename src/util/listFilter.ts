import { isFolderPath } from "@quartz-community/utils/path"

export function isTagPageSlug(slug: string | undefined): boolean {
  if (!slug) return false
  return slug === "tags" || slug === "tags/index" || slug.startsWith("tags/")
}

export function isFolderPageSlug(slug: string | undefined): boolean {
  if (!slug) return false
  return isFolderPath(slug)
}

/** Pages that should not appear in the /updates archive. */
export function isUpdatesListPage(slug: string | undefined): boolean {
  const value = slug ?? ""
  return (
    value !== "updates" &&
    value !== "404" &&
    value !== "dependency_graph" &&
    !value.endsWith("/dependency_graph")
  )
}
