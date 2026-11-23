const gameboard = document.querySelector(".gameboard");
const characterDiv = document.querySelector(".character");
const inventoryDiv = document.querySelector(".inventory");

const story = {
  start: {
    text: "What should we call you?",
    restart: true,
    choices: [
      {
        label: "Nicole",
        next: "weapon",
        character: "name",
      },
      {
        label: "Robert",
        next: "weapon",
        character: "name",
      },
    ],
  },
  weapon: {
    text: "What is your choice of weapon?",
    choices: [
      {
        label: "Rock",
        next: "doors",
        inventory: "Rock",
      },
      {
        label: "Stick",
        next: "doors",
        inventory: "Stick",
      },
    ],
  },
  doors: {
    text: "Which door do you want to enter?",
    choices: [
      {
        label: "Door 1",
        next: "middle",
        character: "name",
      },
      {
        label: "Door 2",
        next: "end",
        character: "name",
      },
    ],
  },
  middle: {
    text: "What do you want to do now?",
    choices: [
      {
        label: "End",
        next: "end",
      },
      {
        label: "Go to start",
        next: "start",
      },
    ],
  },
  end: {
    text: "You won!",
    choices: [
      {
        label: "Restart",
        next: "start",
      },
    ],
  },
};

const state = { inventory: [], character: {} };

const game = new EventTarget();

// event listeners
game.addEventListener("choice:made", (e) => {
  const { next, label, character, inventory } = e.detail;
  if (character) {
    state.character[character] = label;
    ce("character:selection", {
      character: state.character,
    });
  }
  if (inventory) {
    state.inventory.push(inventory);
    ce("inventory:updated", {
      inventory: state.inventory,
    });
  }
  enterScene(next);
});

game.addEventListener("scene:enter", (e) => {
  const { text, choices, restart } = story[e.detail.id];
  if (restart) {
    state.inventory = [];
    state.character = {};
    ce("game:restart");
  }
  gameboard.replaceChildren(
    createText(text),
    ...choices.map((choice) => createButton(choice)),
  );
});

game.addEventListener("character:selection", (e) => {
  const { character } = e.detail;
  characterDiv.innerHTML = `<p>Name: ${character.name}</p>`;
});

game.addEventListener("inventory:updated", (e) => {
  const { inventory } = e.detail;
  inventoryDiv.innerHTML = `<ul>${inventory.map((i) => `<li>${i}</li>`).join("")}</ul>`;
});

game.addEventListener("game:restart", (e) => {
  characterDiv.innerHTML = ``;
  inventoryDiv.innerHTML = ``;
});

// helper functions
const enterScene = (id) => {
  ce("scene:enter", { id });
};

const ce = (name, detail) => {
  game.dispatchEvent(
    new CustomEvent(name, {
      detail,
    }),
  );
};

// ui helpers
const createText = (text) => {
  const p = document.createElement("p");
  p.textContent = text;
  return p;
};

const createButton = (btnObj) => {
  const { label, next, character, inventory } = btnObj;
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.dataset.next = next;
  btn.onclick = () => ce("choice:made", { next, label, character, inventory });
  return btn;
};

enterScene("start");
