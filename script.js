import Grid from "./grid.js";
import Tile from "./Tile.js";

const game_board = document.querySelector(".game-board");
const grid = new Grid(game_board);
grid.randomEmptyCell().tile = new Tile(game_board);
grid.randomEmptyCell().tile = new Tile(game_board);
setupInput();

function setupInput() {
  window.addEventListener("keydown", arrowPressed, { once: true });
}
async function arrowPressed(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;

    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.merge_Tiles());
  const newTile = new Tile(game_board);
  grid.randomEmptyCell().tile = newTile;
  checkWinCondition();

  if (!canMoveDown() && !canMoveUp() && !canMoveLeft() && !canMoveRight()) {
    newTile.wait_for_transition(true).then(() => {
      alert("You Lose🌌");
    });
    return;
  }

  setupInput();
}
function moveUp() {
  return slide_tiles(grid.cells_by_columns);
}
function moveDown() {
  return slide_tiles(grid.cells_by_columns.map((c) => [...c].reverse()));
}
function moveRight() {
  return slide_tiles(grid.cells_by_rows.map((r) => [...r].reverse()));
}
function moveLeft() {
  return slide_tiles(grid.cells_by_rows);
}

function slide_tiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises_arr = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];

        if (cell.tile == null) continue;

        let Last_valid_cell;
        for (let j = i - 1; j >= 0; j--) {
          const move_to_Cell = group[j]; //~ can we move to the cels(s) above us?
          if (!move_to_Cell.canAccept(cell.tile)) {
            break;
          }
          Last_valid_cell = move_to_Cell;
        }
        if (Last_valid_cell != null) {
          promises_arr.push(cell.tile.wait_for_transition());
          if (Last_valid_cell.tile != null) {
            //~ our we moving into a non-empty cell if yes then merge
            Last_valid_cell.mergeTile = cell.tile;
          } else {
            Last_valid_cell.tile = cell.tile;
          }
          cell.tile = null; // # and remove the val from our tile as we moved
        }
      }
      return promises_arr;
    })
  );
}

function canMoveUp() {
  return canMove(grid.cells_by_columns);
}

function canMoveDown() {
  return canMove(grid.cells_by_columns.map((c) => [...c].reverse()));
}
function canMoveLeft() {
  return canMove(grid.cells_by_rows);
}
function canMoveRight() {
  return canMove(grid.cells_by_rows.map((r) => [...r].reverse()));
}
function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const move_to_Cell = group[index - 1];
      return move_to_Cell.canAccept(cell.tile);
    });
  });
}

function checkWinCondition() {
  const win_condition = grid.cells.some((cell) => {
    cell.tile && cell.tile.value >= 2048;
  });
  if (win_condition) {
    alert("You won , somehow. I don't trust you much (⓿_⓿)");
  }
}
