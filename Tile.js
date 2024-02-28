export default class Tile {
  #x;
  #y;
  #value;
  #tileElement;

  constructor(tile_container, val = Math.random() < 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    //# Tile container is game-board
    tile_container.append(this.#tileElement);
    this.value = val;
  }
  set value(val) {
    this.#value = val;
    this.#tileElement.textContent = val;
    const power = Math.log2(val);
    const background_flash = 100 - power * 9;
    this.#tileElement.style.setProperty(
      "--background-flash",
      `${background_flash}%`
    );
    this.#tileElement.style.setProperty(
      "--color-flash",
      `${background_flash <= 50 ? 90 : 10}%`
    );
  }
  set x(val) {
    this.#x = val;
    this.#tileElement.style.setProperty("--x", val);
  }
  set y(val) {
    this.#x = val;
    this.#tileElement.style.setProperty("--y", val);
  }
  remove() {
    this.#tileElement.remove();
  }
  get value() {
    return this.#value;
  }

  wait_for_transition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? "animationend" : "transitionend",
        resolve,
        {
          once: true,
        }
      );
    });
  }
}
