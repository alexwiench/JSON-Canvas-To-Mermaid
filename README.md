# JSON Canvas to Mermaid

Quicky convert JSON Canvas to a Mermaid diagram!

## Usage

```js
// REQUIRED - JSON Canvas data
const data = {
	nodes: [
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

// OPTIONAL - Overwrite any or all of the 6 default colors
const customColors = {
	1: '#ff0000',
	2: '#00ff00',
};

// OPTIONAL - Change Mermaid graph direction
const graphDirection = 'LR';

// Call the function
const mermaidSyntax = generateMermaidFlowchart(data, customColors, graphDirection);
```

## Paramaters

The generateMermaidFlowchart function accepts the following parameters:

- `data` (required): An object that contains the JSON Canvas format.

- `customColors` (optional): An object that allows you to specify custom color mappings for nodes and edges. The keys of the object represent the color identifiers, and the values are the corresponding color codes. If not provided, the function will use the default color map.

- `graphDirection` (optional): A string that specifies the direction of the graph. It determines the orientation of the flowchart. The valid options for graphDirection are:
  - 'TB' (default): Top to bottom
  - 'LR': Left to right
  - 'BT': Bottom to top
  - 'RL': Right to left

## Return Value

The generateMermaidFlowchart function returns the generated Mermaid Flowchart syntax as a string. This syntax can be used to render the flowchart using Mermaid.

## Error Handling

If an invalid graphDirection is provided, the function will throw an error.

## Roadmap

- Add validation for data and color paramaters
- Update as the JSON Canvas spec evolves.
