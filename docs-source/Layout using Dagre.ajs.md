The Dagre Layout script provides an easy way to automatically organize your Archi views using the Dagre graph layout algorithm. This tutorial will guide you through using the script and customizing the layout settings.

## Prerequisites

- Archi with the jArchi plugin installed
- The Dagre Layout script installed in your jArchi scripts folder

## Using the Dagre Layout Script

1. Open your Archi model and select the view you want to layout.
2. Run the Dagre Layout script from the jArchi Scripts menu.
3. A dialog will appear with various layout settings.

## Layout Settings

The dialog provides the following settings:

- **Rank Direction**: Determines the overall flow of the graph.
  - TB: Top to Bottom
  - BT: Bottom to Top
  - LR: Left to Right
  - RL: Right to Left

- **Alignment**: Aligns nodes within the same rank.
  - UL: Up Left
  - UR: Up Right
  - DL: Down Left
  - DR: Down Right

- **Node Separation**: Pixels between nodes horizontally.
- **Edge Separation**: Pixels between edges horizontally.
- **Rank Separation**: Pixels between ranks (rows or columns).
- **Margin X**: Horizontal margin around the graph.
- **Margin Y**: Vertical margin around the graph.
- **Acyclicer**: Method to make the graph acyclic.
  - undefined: No acyclic algorithm applied
  - greedy: Uses a greedy heuristic

- **Ranker**: Algorithm to assign ranks to nodes.
  - network-simplex: Network Simplex algorithm
  - tight-tree: Tight Tree algorithm
  - longest-path: Longest Path algorithm

## Applying the Layout

1. Adjust the settings as desired.
2. Click the "Layout" button to apply the current settings to your view.
3. The view will update to reflect the new layout.
4. You can continue adjusting settings and clicking "Layout" to fine-tune the result.
5. When satisfied, click "Cancel" to close the dialog.

## Tips for Best Results

- Start with the default settings and make small adjustments.
- The "Rank Direction" setting has the most significant impact on the overall layout.
- Increase "Node Separation" and "Rank Separation" for more spread-out layouts.
- Experiment with different "Ranker" algorithms if you're not satisfied with the initial results.

## Troubleshooting

- If the layout seems crowded, try increasing the separation values.
- If nodes are not aligning as expected, try different "Alignment" settings.
- If you encounter cycles in your diagram, try using the "greedy" Acyclicer.

Remember, the effectiveness of the layout can depend on the complexity and structure of your Archi view. Don't hesitate to experiment with different settings to achieve the best result for your specific diagram.