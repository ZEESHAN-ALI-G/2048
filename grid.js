const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
  #cells;
  get cells() {
    return this.#cells;
  }

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }
  get cells_by_rows() {
    return this.#cells.reduce((cell_grid, cell) => {
      cell_grid[cell.y] = cell_grid[cell.y] || [];
      cell_grid[cell.y][cell.x] = cell;
      return cell_grid;
    }, []);
  }
  get cells_by_columns() {
    return this.#cells.reduce((cell_grid, cell) => {
      cell_grid[cell.x] = cell_grid[cell.x] || [];
      cell_grid[cell.x][cell.y] = cell;
      return cell_grid;
    }, []);
  }
  get #empty_cells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }
  randomEmptyCell() {
    const random_index = Math.floor(Math.random() * this.#empty_cells.length);
    return this.#empty_cells[random_index];
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;
  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }
  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }
  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) {
      return;
    }
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) {
      return;
    }
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }
  merge_Tiles() {
    if (this.tile == null || this.mergeTile == null) {
      return;
    }
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

function createCellElements(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.append(cell);
  }
  return cells;
}
