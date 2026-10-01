# quartz-v5-plugin-recent-notes

Recent-notes list for Quartz v5. The section title can link to a full archive.

## Install

Quartz builds the plugin from source on install.

```yaml
plugins:
  - source: github:zeroDtree/quartz-v5-plugin-recent-notes
    enabled: true
    options:
      limit: 3
      showTags: false
      hideTagPages: true
      hideFolderPages: true
      linkToMore: updates
    layout:
      position: right
      priority: 12
      display: desktop-only
      condition: not-updates-page
```

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `limit` | `3` | Notes shown in the sidebar |
| `linkToMore` | `false` | Archive slug, or `false` |
| `showTags` | `true` | Show tags on each row |
| `showTitle` | `true` | Show the section title |
| `hideTagPages` | `false` | Omit tag index pages |
| `hideFolderPages` | `false` | Omit folder index pages |

## Usage

The plugin emits a virtual `/updates` page. Do not add `content/updates.md`.

If `linkToMore` is `updates` and the sidebar uses `condition: not-updates-page`, register those conditions in `quartz.ts`. A `filter` cannot be set in YAML; pass it with `setOptionOverrides` when you need extra exclusions.

```ts
import { registerCondition } from "./quartz/plugins/loader/conditions"
import { componentRegistry } from "./quartz/components/registry"
import type { QuartzPluginData } from "./quartz/plugins/vfile"

registerCondition("is-updates-page", (props) => props.fileData.slug === "updates")
registerCondition("not-updates-page", (props) => props.fileData.slug !== "updates")

componentRegistry.setOptionOverrides("quartz-v5-plugin-recent-notes", {
  filter: (f: QuartzPluginData) => {
    const slug = f.slug ?? ""
    return (
      slug !== "updates" &&
      slug !== "404" &&
      slug !== "dependency_graph" &&
      !slug.endsWith("/dependency_graph")
    )
  },
})
```

Omit `setOptionOverrides` if you do not need that filter. Use `condition: is-updates-page` on layout items that should appear only on the archive.

## Development

```bash
git clone git@github.com:zeroDtree/quartz-v5-plugin-recent-notes.git my-plugins/quartz-v5-plugin-recent-notes
cd my-plugins/quartz-v5-plugin-recent-notes
npm ci
npm run dev
```

Point the site at `source: ./my-plugins/quartz-v5-plugin-recent-notes` while editing. After pushing, switch back to the GitHub source.

## Scripts

```bash
npm run check
npm run build
```

## License

MIT
