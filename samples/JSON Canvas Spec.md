# JSON Canvas Spec

<small>Version 1.0 — 2024-03-11</small>

## Top level

The top level of JSON Canvas contains two arrays:

- `nodes` (optional, array of nodes)
- `edges` (optional, array of edges)

## Nodes

Nodes are objects within the canvas. Nodes may be text, files, links, or groups.

### Generic node

All nodes include the following attributes:

- `id` (required, string) is a unique ID for the node.
- `type` (required, string) is the node type.
  - `text`
  - `file`
  - `link`
  - `group`
- `x` (required, integer) is the `x` position of the node in pixels.
- `y` (required, integer) is the `y` position of the node in pixels.
- `width` (required, integer) is the width of the node in pixels.
- `height` (required, integer) is the height of the node in pixels.
- `color` (optional, `canvasColor`) is the color of the node, see the Color section.

### Text type nodes

Text type nodes store text, and include the following attribute:

- `text` (required, string) in plain text with Markdown syntax.

### File type nodes

File type nodes reference other files or attachments, such as images, videos, etc. They include the following attributes:

- `file` (required, string) is the path to the file within the system.
- `subpath` (optional, string) is a subpath that may link to a heading or a block. Always starts with a `#`.

### Link type nodes

Link type nodes reference a URL, and include the following attribute:

- `url` (required, string)

### Group type nodes

Group type nodes are used as a visual container for nodes within it. They include the following attributes:

- `label` (optional, string) is a text label for the group.
- `background` (optional, string) is the path to the background image.
- `backgroundStyle` (optional, string) is the rendering style of the background image. Valid values:
  - `cover` fills the entire width and height of the node.
  - `ratio` maintains the aspect ratio of the background image.
  - `repeat` repeats the image as a pattern in both x/y directions.

## Edges

Edges are lines that connect one node to another.

- `id` (required, string) is a unique ID for the edge.
- `fromNode` (required, string) is the node `id` where the connection starts.
- `fromSide` (optional, string) is the side where this edge starts. Valid values:
  - `top`
  - `right`
  - `bottom`
  - `left`
- `fromEnd` (optional, string) is the shape of the endpoint at the edge start. Valid values:
  - `none`
  - `arrow`
- `toNode` (required, string) is the node `id` where the connection ends.
- `toSide` (optional, string) is the side where this edge ends. Valid values:
  - `top`
  - `right`
  - `bottom`
  - `left`
- `toEnd`  (optional, string) is the shape of the endpoint at the edge end. Valid values:
  - `none`
  - `arrow`
- `color` (optional, `canvasColor`) is the color of the line, see the Color section.
- `label` (optional, string) is a text label for the edge.


## Color

The `color` type is used to encode color data for nodes and edges. Colors attributes expect a string. Colors can be specified in hex format, e.g. `"#FFFFFF"`. Six preset colors exist, mapped to the following numbers:

- `1` red
- `2` orange
- `3` yellow
- `4` green
- `5` cyan
- `6` purple
