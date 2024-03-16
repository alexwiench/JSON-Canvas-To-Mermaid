# JSON Canvas to Mermaid

# JSON Canvas to Mermaid

Quicky convert JSON Canvas to a Mermaid diagram!

This package exports two functions. The `generateMermaidFlowchart()` function converts your canvas into Mermaid syntax. The `buildJsonCanvasHierarchy()` function extends the JSON Canvas data with a children property and adds the id's of a group's children to it. Useful for building tools utilizing JSON Canvas as an explicitit hierarchy is not included as part of the JSON Canvas spec.

## Usage

See `ExampleUsage.js`

## Avalible Functions

### `generateMermaidFlowchart(data, customColors, graphDirection)`

The generateMermaidFlowchart function accepts the following parameters:

- `data` (required): An object that contains the JSON Canvas format.

- `customColors` (optional): An object that allows you to specify custom color mappings for nodes and edges. The keys of the object represent the color identifiers, and the values are the corresponding color codes. If not provided, the function will use the default color map.

- `graphDirection` (optional): A string that specifies the direction of the graph. It determines the orientation of the flowchart. The valid options for graphDirection are:
  - 'TB' (default): Top to bottom
  - 'LR': Left to right
  - 'BT': Bottom to top
  - 'RL': Right to left

#### Return Value

The generateMermaidFlowchart function returns the generated Mermaid Flowchart syntax as a string. This syntax can be used to render the flowchart using Mermaid.

#### Error Handling

If an invalid graphDirection is provided, the function will throw an error.

### `(buildJsonCanvasHierarchy(data)`

- data (required): An object that contains the JSON Canvas format.

#### Return Value

The buildJsonCanvasHierarchy function returns the generated the inputed data with an additional `children` property on nodes.

## Roadmap

- Add validation for data and color paramaters
- Update as the JSON Canvas spec evolves.

## Usage

See `ExampleUsage.js`

## Avalible Functions

### `generateMermaidFlowchart(data, customColors, graphDirection)`

The generateMermaidFlowchart function accepts the following parameters:

- `data` (required): An object that contains the JSON Canvas format.

- `customColors` (optional): An object that allows you to specify custom color mappings for nodes and edges. The keys of the object represent the color identifiers, and the values are the corresponding color codes. If not provided, the function will use the default color map.

- `graphDirection` (optional): A string that specifies the direction of the graph. It determines the orientation of the flowchart. The valid options for graphDirection are:
  - 'TB' (default): Top to bottom
  - 'LR': Left to right
  - 'BT': Bottom to top
  - 'RL': Right to left

#### Return Value

The generateMermaidFlowchart function returns the generated Mermaid Flowchart syntax as a string. This syntax can be used to render the flowchart using Mermaid.

#### Error Handling

If an invalid graphDirection is provided, the function will throw an error.

### `(buildJsonCanvasHierarchy(data)`

- data (required): An object that contains the JSON Canvas format.

#### Return Value

The buildJsonCanvasHierarchy function returns the generated the inputed data with an additional `children` property on nodes.

## Roadmap

- Add validation for data and color paramaters
- Update as the JSON Canvas spec evolves.
