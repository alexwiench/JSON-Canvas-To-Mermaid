# JSON Canvas to Mermaid

[![npm version](https://badge.fury.io/js/json-canvas-to-mermaid.svg)](https://badge.fury.io/js/json-canvas-to-mermaid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform your JSON Canvas data into Mermaid flowcharts with ease. This lightweight and powerful library bridges the gap between JSON Canvas and Mermaid, enabling you to visualize your canvas data in a whole new way.

> [!TIP]
> Give it a try! Convert `.canvas` files to Mermaid syntax right in your browser. https://alexwiench.github.io/json-canvas-to-mermaid-demo/

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
- [How It Works](#how-it-works)
- [Usage](#usage)
- [API Reference](#api-reference)
	- [`convertToMermaid(data, customColors, graphDirection)`](#converttomermaiddata-customcolors-graphdirection)
	- [Additional Utilities](#additional-utilities)
- [Examples](#examples)
	- [Basic Usage](#basic-usage)
	- [Advanced Usage](#advanced-usage)
	- [Using Validation and CreateNodeTree Utilities](#using-validation-and-createnodetree-utilities)
		- [Validation](#validation)
		- [CreateNodeTree](#createnodetree)
- [What are JSON Canvas and Mermaid?](#what-are-json-canvas-and-mermaid)
- [License](#license)

## Features

- Convert JSON Canvas data to Mermaid flowchart syntax
- Support for all node types and features in the JSON Canvas spec
- Handle nested group structures
- Apply custom colors to nodes and edges
- Generate appropriate syntax for different edge types and labels
- Zero dependencies

## Installation

```bash
npm install json-canvas-to-mermaid
```

## How It Works

JSON Canvas to Mermaid works in three main steps:

1. **Validation**: It checks the input JSON Canvas data for correctness and completeness.
2. **Hierarchy Creation**: It builds a tree-like structure from the flat JSON Canvas data, identifying parent-child relationships between nodes.
3. **Mermaid Syntax Generation**: It converts the hierarchical structure into Mermaid flowchart syntax, handling various node types, edges, and styling.

## Usage

Here's a quick example of how to use the library:

```javascript
import { convertToMermaid } from 'json-canvas-to-mermaid';

const jsonCanvasData = {
	nodes: [
		{ id: 'node1', type: 'text', text: 'Hello', x: 0, y: 0, width: 100, height: 50 },
		{ id: 'node2', type: 'text', text: 'World', x: 200, y: 0, width: 100, height: 50 },
	],
	edges: [{ id: 'edge1', fromNode: 'node1', toNode: 'node2' }],
};

const mermaidSyntax = convertToMermaid(jsonCanvasData);
console.log(mermaidSyntax);
```

## API Reference

### `convertToMermaid(data, customColors, graphDirection)`

Converts JSON Canvas data to Mermaid flowchart syntax.

- `data`: The JSON Canvas data object containing nodes and edges.
- `customColors` (optional): An object mapping color identifiers to hex color codes. Maximum of 6 colors.
- `graphDirection` (optional): The direction of the graph. Valid options are 'TB', 'LR', 'BT', 'RL'. Default is 'TB'.

Returns a string containing the Mermaid flowchart syntax.

### Additional Utilities

The library also exports some additional utilities that were developed as part of this project. While not necessary for the primary use case, they're available if you need them for other projects:

- `createNodeTree(data)`: Creates a hierarchical structure from flat JSON Canvas data.
- `validateJsonCanvasData(data)`: Validates the structure and content of JSON Canvas data.
- `validateCustomColors(customColors)`: Validates the custom colors object.
- `validateGraphDirection(graphDirection)`: Validates the graph direction parameter.

These functions are not required for normal use of the library but are exposed for developers who might find them useful in other contexts.

## Examples

### Basic Usage

```javascript
import { convertToMermaid } from 'json-canvas-to-mermaid';

const data = {
	nodes: [
		{ id: 'node1', type: 'text', text: 'Node 1', x: 0, y: 0, width: 100, height: 50 },
		{ id: 'node2', type: 'text', text: 'Node 2', x: 200, y: 0, width: 100, height: 50 },
	],
	edges: [{ id: 'edge1', fromNode: 'node1', toNode: 'node2' }],
};

const mermaidSyntax = convertToMermaid(data);
console.log(mermaidSyntax);
```

### Advanced Usage

```javascript
const customColors = {
	1: '#ff0000',
	2: '#00ff00',
	3: '#0000ff',
};

const customDirection = 'LR';

const data = {
	nodes: [
		{ id: 'node1', type: 'text', text: 'Red Node', x: 0, y: 0, width: 100, height: 50, color: '1' },
		{
			id: 'node2',
			type: 'text',
			text: 'Green Node',
			x: 200,
			y: 0,
			width: 100,
			height: 50,
			color: '2',
		},
	],
	edges: [{ id: 'edge1', fromNode: 'node1', toNode: 'node2', color: '3' }],
};

const mermaidSyntax = convertToMermaid(data, customColors, customDirection);
```

### Using Validation and CreateNodeTree Utilities

While not necessary for the primary use case, the validation and createNodeTree utilities can be useful in certain scenarios. Here's how you can use them:

#### Validation

You can use the validation functions to check your JSON Canvas data or other parameters:

```javascript
import { jsonCanvas } from 'json-canvas-to-mermaid';

const data = {
	nodes: [
		{ id: 'node1', type: 'text', text: 'Hello', x: 0, y: 0, width: 100, height: 50 },
		{ id: 'node2', type: 'text', text: 'World', x: 200, y: 0, width: 100, height: 50 },
	],
	edges: [{ id: 'edge1', fromNode: 'node1', toNode: 'node2' }],
};

try {
	jsonCanvas.validate.data(data);
	console.log('JSON Canvas data is valid');
} catch (error) {
	console.error('Invalid JSON Canvas data:', error.message);
}

// Validate custom colors
const customColors = { 1: '#ff0000', 2: '#00ff00' };
try {
	jsonCanvas.validate.colors(customColors);
	console.log('Custom colors are valid');
} catch (error) {
	console.error('Invalid custom colors:', error.message);
}

// Validate graph direction
const direction = 'LR';
try {
	jsonCanvas.validate.direction(direction);
	console.log('Graph direction is valid');
} catch (error) {
	console.error('Invalid graph direction:', error.message);
}
```

#### CreateNodeTree

The createNodeTree function can be used to generate a hierarchical structure from flat JSON Canvas data:

```javascript
import { jsonCanvas } from 'json-canvas-to-mermaid';

const data = {
	nodes: [
		{ id: 'group1', type: 'group', x: 0, y: 0, width: 300, height: 200 },
		{ id: 'node1', type: 'text', text: 'Inside Group', x: 50, y: 50, width: 100, height: 50 },
		{ id: 'node2', type: 'text', text: 'Outside Group', x: 400, y: 50, width: 100, height: 50 },
	],
	edges: [],
};

const hierarchicalData = jsonCanvas.createNodeTree(data);
console.log(JSON.stringify(hierarchicalData, null, 2));

// Output:
// {
//   "nodes": [
//     {
//       "id": "group1",
//       "type": "group",
//       "x": 0,
//       "y": 0,
//       "width": 300,
//       "height": 200,
//       "children": ["node1"]
//     },
//     {
//       "id": "node1",
//       "type": "text",
//       "text": "Inside Group",
//       "x": 50,
//       "y": 50,
//       "width": 100,
//       "height": 50,
//       "children": null
//     },
//     {
//       "id": "node2",
//       "type": "text",
//       "text": "Outside Group",
//       "x": 400,
//       "y": 50,
//       "width": 100,
//       "height": 50,
//       "children": null
//     }
//   ],
//   "edges": []
// }
```

This hierarchical structure can be useful if you need to process the JSON Canvas data in a tree-like format for other purposes in your application.

## What are JSON Canvas and Mermaid?

Learn more about those projects here:

- JSON Canvas: https://jsoncanvas.org/
- Mermaid: https://mermaid.js.org/

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
