import { expect, test, describe } from 'bun:test';
import { buildJsonCanvasHierarchy } from '../index.js';

describe('buildJsonCanvasHierarchy', () => {
	describe('Group Hierarchy', () => {
		test('should create correct hierarchy for nested group structure', () => {
			const input = {
				nodes: [
					{
						id: 'Group 1',
						x: -300,
						y: -380,
						width: 620,
						height: 320,
						type: 'group',
						label: 'Group 1',
					},
					{
						id: 'Group 2',
						x: -260,
						y: -240,
						width: 540,
						height: 140,
						type: 'group',
						label: 'Group 2',
					},
					{ id: 'Node 1', x: -260, y: -340, width: 250, height: 60, type: 'text', text: 'Node 1' },
					{ id: 'Node 2', x: -220, y: -200, width: 250, height: 60, type: 'text', text: 'Node 2' },
					{ id: 'Node 3', x: -300, y: -20, width: 250, height: 60, type: 'text', text: 'Node 3' },
				],
				edges: [],
			};

			const result = buildJsonCanvasHierarchy(input);

			expect(result.nodes).toHaveLength(5);
			expect(result.nodes.find((n) => n.id === 'Group 1').children).toEqual(['Group 2', 'Node 1']);
			expect(result.nodes.find((n) => n.id === 'Group 2').children).toEqual(['Node 2']);
			expect(result.nodes.find((n) => n.id === 'Node 1').children).toBeNull();
			expect(result.nodes.find((n) => n.id === 'Node 2').children).toBeNull();
			expect(result.nodes.find((n) => n.id === 'Node 3').children).toBeNull();
		});

		test('should handle overlapping groups correctly', () => {
			const input = {
				nodes: [
					{ id: 'Group 1', x: 0, y: 0, width: 200, height: 200, type: 'group', label: 'Group 1' },
					{
						id: 'Group 2',
						x: 100,
						y: 100,
						width: 200,
						height: 200,
						type: 'group',
						label: 'Group 2',
					},
					{ id: 'Node 1', x: 150, y: 150, width: 50, height: 50, type: 'text', text: 'Node 1' },
				],
				edges: [],
			};

			const result = buildJsonCanvasHierarchy(input);

			expect(result.nodes.find((n) => n.id === 'Group 1').children).toEqual(['Node 1']);
			expect(result.nodes.find((n) => n.id === 'Group 2').children).toEqual(['Group 1']);
		});
	});

	describe('Node Placement', () => {
		test('should correctly place nodes in groups', () => {
			const input = {
				nodes: [
					{ id: 'Group', x: 0, y: 0, width: 300, height: 300, type: 'group', label: 'Group' },
					{ id: 'Inside', x: 50, y: 50, width: 50, height: 50, type: 'text', text: 'Inside' },
					{ id: 'Outside', x: 350, y: 350, width: 50, height: 50, type: 'text', text: 'Outside' },
				],
				edges: [],
			};

			const result = buildJsonCanvasHierarchy(input);

			expect(result.nodes.find((n) => n.id === 'Group').children).toEqual(['Inside']);
			expect(result.nodes.find((n) => n.id === 'Outside').children).toBeNull();
		});
	});

	describe('Edge Preservation', () => {
		test('should preserve all edge data', () => {
			const input = {
				nodes: [
					{ id: 'Group', x: -340, y: -320, width: 340, height: 140, type: 'group', label: 'Group' },
					{ id: 'Node1', x: -300, y: -280, width: 250, height: 60, type: 'text', text: 'Node 1' },
					{ id: 'Node2', x: 160, y: -280, width: 250, height: 60, type: 'text', text: 'Node 2' },
				],
				edges: [
					{
						id: 'Edge1',
						fromNode: 'Group',
						fromSide: 'right',
						toNode: 'Node2',
						toSide: 'top',
						fromEnd: 'arrow',
					},
					{ id: 'Edge2', fromNode: 'Node1', fromSide: 'right', toNode: 'Node2', toSide: 'bottom' },
				],
			};

			const result = buildJsonCanvasHierarchy(input);

			expect(result.edges).toEqual(input.edges);
		});
	});

	describe('Special Cases', () => {
		test('should handle empty input correctly', () => {
			const input = { nodes: [], edges: [] };
			const result = buildJsonCanvasHierarchy(input);
			expect(result.nodes).toEqual([]);
			expect(result.edges).toEqual([]);
		});

		test('should handle input with only non-group nodes', () => {
			const input = {
				nodes: [
					{ id: 'Node1', x: 0, y: 0, width: 100, height: 50, type: 'text', text: 'Node 1' },
					{ id: 'Node2', x: 200, y: 0, width: 100, height: 50, type: 'text', text: 'Node 2' },
				],
				edges: [],
			};

			const result = buildJsonCanvasHierarchy(input);

			expect(result.nodes).toHaveLength(2);
			expect(result.nodes[0].children).toBeNull();
			expect(result.nodes[1].children).toBeNull();
		});
	});
});
