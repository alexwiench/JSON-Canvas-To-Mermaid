import generateMermaidFlowchart, { buildJsonCanvasHierarchy } from '../index.js';

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

// Output mermaid flowchart with custom #2 and #4 colors and specifiying the graph direction
console.log(generateMermaidFlowchart(data, { 2: '#d7d544', 4: '#e9973f' }, 'LR'));
