import type {
  FilePath,
  FullSlug,
  QuartzComponentConstructor,
  QuartzPageTypePlugin,
  QuartzPluginData,
  ProcessedContent,
} from "@quartz-community/types"
import { VFile } from "vfile"
import RecentNotes from "./components/RecentNotes"
import { isUpdatesListPage } from "./util/listFilter"

const UPDATES_SLUG = "updates" as FullSlug

function defaultProcessedContent(
  vfileData: Partial<QuartzPluginData>,
): ProcessedContent {
  const root = { type: "root" as const, children: [] }
  const vfile = new VFile("")
  vfile.data = vfileData
  return [root, vfile]
}

const updatesListFilter = (f: QuartzPluginData & Record<string, unknown>) =>
  isUpdatesListPage(f.slug as string | undefined)

const UpdatesListBody: QuartzComponentConstructor = () =>
  RecentNotes({
    limit: 1000,
    showTags: false,
    hideTagPages: true,
    hideFolderPages: true,
    linkToMore: false,
    showTitle: true,
    filter: updatesListFilter,
  })

export const UpdatesPage: QuartzPageTypePlugin<{ title?: string }> = (userOpts) => {
  const title = userOpts?.title ?? "Recent Notes"
  return {
    name: "UpdatesPage",
    priority: 15,
    match: ({ slug }) => slug === UPDATES_SLUG,
    generate() {
      const [, vfile] = defaultProcessedContent({
        slug: UPDATES_SLUG,
        relativePath: `${UPDATES_SLUG}.md` as FilePath,
        description: "按修改时间排序的完整笔记列表",
        frontmatter: { title, tags: [], unlisted: true },
        unlisted: true,
      })
      return [
        {
          slug: UPDATES_SLUG,
          title,
          data: vfile.data,
        },
      ]
    },
    layout: "updates",
    body: UpdatesListBody,
  }
}
