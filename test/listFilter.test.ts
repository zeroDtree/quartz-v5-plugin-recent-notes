import { describe, expect, it } from "vitest"
import { isFolderPageSlug, isTagPageSlug, isUpdatesListPage } from "../src/util/listFilter"

describe("isTagPageSlug", () => {
  it("matches the tag index and tag pages", () => {
    expect(isTagPageSlug("tags")).toBe(true)
    expect(isTagPageSlug("tags/index")).toBe(true)
    expect(isTagPageSlug("tags/linux")).toBe(true)
    expect(isTagPageSlug("about")).toBe(false)
  })
})

describe("isFolderPageSlug", () => {
  it("matches folder indexes", () => {
    expect(isFolderPageSlug("计算机/")).toBe(true)
    expect(isFolderPageSlug("计算机/index")).toBe(true)
    expect(isFolderPageSlug("计算机/docker")).toBe(false)
  })
})

describe("isUpdatesListPage", () => {
  it("drops the archive page, 404, and dependency graphs", () => {
    expect(isUpdatesListPage("updates")).toBe(false)
    expect(isUpdatesListPage("404")).toBe(false)
    expect(isUpdatesListPage("dependency_graph")).toBe(false)
    expect(isUpdatesListPage("杂/dependency_graph")).toBe(false)
    expect(isUpdatesListPage("关于")).toBe(true)
  })
})
