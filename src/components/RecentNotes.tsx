import type {
  GlobalConfiguration,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPluginData,
  SortFn,
  ValidDateType,
  FullSlug,
} from "@quartz-community/types"
import { formatDate } from "@quartz-community/utils/date"
import { byDateAndAlphabetical, getDate } from "@quartz-community/utils/sort"
import { classNames } from "@quartz-community/utils/lang"
import { resolveRelative } from "@quartz-community/utils/path"
import { isFolderPageSlug, isTagPageSlug } from "../util/listFilter"

type RecentNotesPluginData = QuartzPluginData & Record<string, unknown>

export interface RecentNotesOptions {
  title?: string
  limit: number
  linkToMore: string | false
  showTags: boolean
  showTitle: boolean
  hideTagPages: boolean
  hideFolderPages: boolean
  filter: (f: RecentNotesPluginData) => boolean
  sort: SortFn
}

function resolveDefaultDateType(
  data: RecentNotesPluginData,
  cfg: GlobalConfiguration,
): ValidDateType | undefined {
  return (
    (data.defaultDateType as ValidDateType | undefined) ??
    ((cfg as Record<string, unknown>).defaultDateType as ValidDateType | undefined)
  )
}

const withResolvedDateType = (
  data: RecentNotesPluginData,
  cfg: GlobalConfiguration,
): QuartzPluginData => {
  const resolved = resolveDefaultDateType(data, cfg)
  if (!resolved) return data as QuartzPluginData
  return { ...data, defaultDateType: resolved }
}

function filterListedPages<T>(pages: T[]): T[] {
  return pages.filter((p) => (p as { unlisted?: unknown }).unlisted !== true)
}

const byDateAndAlphabeticalWithConfig = (cfg: GlobalConfiguration): SortFn => {
  const sortFn = byDateAndAlphabetical()
  return (f1, f2) =>
    sortFn(
      withResolvedDateType(f1 as RecentNotesPluginData, cfg),
      withResolvedDateType(f2 as RecentNotesPluginData, cfg),
    )
}

const defaultOptions = (cfg: GlobalConfiguration): RecentNotesOptions => ({
  title: "Recent Notes",
  limit: 3,
  linkToMore: false,
  showTags: true,
  showTitle: true,
  hideTagPages: false,
  hideFolderPages: false,
  filter: () => true,
  sort: byDateAndAlphabeticalWithConfig(cfg),
})

export default ((userOpts?: Partial<RecentNotesOptions>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = filterListedPages(allFiles as RecentNotesPluginData[])
      .filter((p) => !opts.hideTagPages || !isTagPageSlug(p.slug))
      .filter((p) => !opts.hideFolderPages || !isFolderPageSlug(p.slug))
      .filter(opts.filter)
      .sort(opts.sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    const slug = (fileData.slug ?? "index") as FullSlug
    const locale = cfg.locale ?? "en-US"
    const title = opts.title ?? "Recent Notes"

    return (
      <div class={classNames(displayClass, "recent-notes")}>
        {opts.showTitle && (
          <h3>
            {opts.linkToMore ? (
              <a href={resolveRelative(slug, opts.linkToMore as FullSlug)} class="internal">
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
        )}
        <ul class="recent-ul">
          {pages.slice(0, opts.limit).map((page) => {
            const pageTitle = page.frontmatter?.title ?? "Untitled"
            const tags = page.frontmatter?.tags ?? []
            const date = page.dates ? getDate(withResolvedDateType(page, cfg)) : undefined

            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a href={resolveRelative(slug, page.slug! as FullSlug)} class="internal">
                        {pageTitle}
                      </a>
                    </h3>
                  </div>
                  {date && (
                    <p class="meta">
                      <time datetime={date.toISOString()}>{formatDate(date, locale)}</time>
                    </p>
                  )}
                  {opts.showTags && (
                    <ul class="tags">
                      {tags.map((tag) => (
                        <li>
                          <a
                            class="internal tag-link"
                            href={resolveRelative(slug, `tags/${tag}` as FullSlug)}
                          >
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {opts.linkToMore && remaining > 0 && (
          <p>
            <a href={resolveRelative(slug, opts.linkToMore as FullSlug)}>See {remaining} more →</a>
          </p>
        )}
      </div>
    )
  }

  RecentNotes.css = `
.recent-notes > h3 {
  margin: 0.5rem 0 0 0;
  font-size: 1rem;
}
.recent-notes > h3 > a {
  color: inherit;
  background-color: transparent;
}
.recent-notes > ul.recent-ul {
  list-style: none;
  margin-top: 1rem;
  padding-left: 0;
}
.recent-notes > ul.recent-ul > li {
  margin: 1rem 0;
}
.recent-notes > ul.recent-ul > li .section > .desc > h3 > a {
  background-color: transparent;
}
.recent-notes > ul.recent-ul > li .section > .meta {
  margin: 0 0 0.5rem 0;
  opacity: 0.6;
}
`

  return RecentNotes
}) satisfies QuartzComponentConstructor<Partial<RecentNotesOptions>>
