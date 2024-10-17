# Pathfinding Algorithm Visualization

This project is a pathfinding algorithm visualization tool created with Svelte and TypeScript. It allows users to interactively visualize the A\* algorithm using three different heuristic functions (Euclidean, Manhattan, and Diagonal) and the Dijkstra algorithm. Whether you're a student learning about pathfinding algorithms or a developer looking for a visual representation of these algorithms, this tool provides a helpful way to understand and explore how they work.

## Table of Contents

- [Authors](#authors)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)

## Authors

- [Gabriel Araújo Freitas](https://github.com/FreitasGa) - GitHub Profile
- [Diogo Dias Mello](https://github.com/DiogoMEng) - GitHub Profile

## Features

- Interactive grid where you can toggle walls by clicking on cells.
- Ability to move the start and goal nodes by clicking and dragging them.
- Three heuristic functions for the A\* algorithm: Euclidean, Manhattan, and Diagonal.
- Visualization of the A\* algorithm and Dijkstra algorithm.
- Real-time information on open and closed nodes, as well as the path found.
- Four buttons for easy control: Start, Reset Path, Reset Walls, and Reset Start & Goal.

## Getting Started

Follow these steps to get a copy of the project up and running on your local machine.

1. **Clone the repository**:

```bash
   git clone https://github.com/FreitasGa/pathfinder.git
```

2. **Navigate to the project directory**:

```bash
   cd pathfinder
```

3. **Install the dependencies**:

```bash
   npm install
```

4. **Start the development server**:

```bash
   npm run dev
```

This will launch the development server, and you can access the application in your web browser at [localhost:5173](http://localhost:5173/).

## Usage

1. **Drawing the Grid**:

   - Click on a grid cell to toggle walls. Click again to remove walls.

2. **Moving Start and Goal Nodes**:

   - Click and drag the start and goal nodes to change their positions on the grid.

3. **Selecting the Algorithm and Heuristic**:

   - Choose an algorithm (A* or Dijkstra) from the dropdown menu.
   - Select a heuristic function (Euclidean, Manhattan, or Diagonal) for the A* algorithm.

4. **Running the Algorithm**:

   - Click the "Start" button to run the selected algorithm.

5. **Resetting**:

   - Click the "Reset Path" button to clear the path found by the algorithm but keep walls, start, and end points.
   - Click the "Reset Walls" button to clear the walls on the grid but keep the path, start, and end points.
   - Click the "Reset Start & Goal" button to clear the start and end points on the grid.
