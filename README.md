# JSON Canvas to Mermaid

Quicky convert JSON Canvas to a Mermaid diagram!

This package exports two functions. The `generateMermaidFlowchart()` function converts your canvas into Mermaid syntax. The `buildJsonCanvasHierarchy()` function extends the JSON Canvas data with a `children` property and adds the IDs of a group's children to it. This is useful for building tools utilizing JSON Canvas, as an explicit hierarchy is not included as part of the JSON Canvas spec.

Live demo site: https://alexwiench.github.io/json-canvas-to-mermaid-demo/

Learn More:

- JSON Canvas: <https://jsoncanvas.org/>
- Mermaid: <https://mermaid.js.org/>

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

## Usage

```js
import generateMermaidFlowchart, { buildJsonCanvasHierarchy } from './index.js';

let data = {
	nodes: [
		{
			id: '6f002d2b0257ffa4',
			x: -1601,
			y: -826,
			width: 631,
			height: 100,
			color: '#248a42',
			type: 'group',
			label: 'Group One',
		},
		{
			id: '5696e6f4d7feef3b',
			x: -1581,
			y: -806,
			width: 250,
			height: 60,
			color: '4',
			type: 'text',
			text: 'Node One',
		},
		{
			id: 'eb886f14ff2b15a1',
			x: -1240,
			y: -806,
			width: 250,
			height: 60,
			color: '6',
			type: 'text',
			text: 'Node Two',
		},
	],
	edges: [
		{
			id: 'ed452a5525485f24',
			fromNode: '5696e6f4d7feef3b',
			fromSide: 'right',
			toNode: 'eb886f14ff2b15a1',
			toSide: 'left',
			color: '2',
		},
	],
};

// Output json data with `children` property added
console.log(buildJsonCanvasHierarchy(data));

// OPTIONAL - Overwrite any or all of the 6 default colors
const customColors = {
	2: '#ff0000',
	4: '#00ff00',
};

// OPTIONAL - Change Mermaid graph direction
const graphDirection = 'LR';

// Output mermaid flowchart
console.log(generateMermaidFlowchart(data, customColors, graphDirection));
```

Mermaid output:

```Mermaid
graph LR
subgraph 6f002d2b0257ffa4["Group One"]
5696e6f4d7feef3b["Node One"]
eb886f14ff2b15a1["Node Two"]

end
5696e6f4d7feef3b["Node One"]
eb886f14ff2b15a1["Node Two"]
5696e6f4d7feef3b -->  eb886f14ff2b15a1
style 6f002d2b0257ffa4 fill:#248a42, stroke:#00570f
style 5696e6f4d7feef3b fill:#00ff00, stroke:#00cc00
style eb886f14ff2b15a1 fill:#a882ff, stroke:#754fcc
style 5696e6f4d7feef3b fill:#00ff00, stroke:#00cc00
style eb886f14ff2b15a1 fill:#a882ff, stroke:#754fcc
linkStyle 0 stroke:#ff0000
```

For working sample, download this repository and run `ExampleUsage.js`

## Roadmap

- Add validation for data and color paramaters
- Update as the JSON Canvas spec evolves.
