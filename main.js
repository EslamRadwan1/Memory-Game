// Starting The Game
const startBtn = document.querySelector(".control-buttons span");
const nameInput = document.querySelector(".control-buttons input");
const maxLengthInput = nameInput.getAttribute("maxlength");
const charCount = document.querySelector(".control-buttons .char-count");
const duration = 1000;
const blocksContainer = document.querySelector(".memory-game-blocks");
const blocks = Array.from(blocksContainer.children);
const orderRange = [...Array(blocks.length).keys()];
let tries = 10;

charCount.innerHTML = `0/${maxLengthInput}`;
nameInput.addEventListener("input", () => {
  charCount.innerHTML = `${nameInput.value.length}/${maxLengthInput}`;
});

startBtn.addEventListener("click", () => {
  const userName = nameInput.value;
  if (userName.trim() === "" || userName === undefined) {
    document.querySelector(".name span").innerHTML = "Unknown";
  } else {
    document.querySelector(".name span").innerHTML = userName;
  }
  document.querySelector(".overlay").remove();
  theGame();
});
/* ================================================== */

// The Game
function theGame() {
  document.querySelector(".tries span").textContent = tries;

  shuffle(orderRange);

  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    setTimeout(() => {
      block.classList.add("is-flipped");
      setTimeout(() => {
        block.classList.remove("is-flipped");
      }, duration);
    }, duration / 4);
    block.addEventListener("click", () => {
      flipBlock(block);
    });
  });
}

function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");

  // Collect Flipepd Cards
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped"),
  );

  if (allFlippedBlocks.length === 2) {
    stopClicking();
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
    if (
      tries === 0 ||
      blocks.every((block) => block.classList.contains("has-match"))
    ) {
      showResults();
    }
  }
}
function stopClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.fruit === secondBlock.dataset.fruit) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
  } else {
    firstBlock.style.animation = "dismatch .4s";
    secondBlock.style.animation = "dismatch .4s";
    setTimeout(() => {
      firstBlock.style.animation = "";
      secondBlock.style.animation = "";

      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
    tries--;
    document.querySelector(".tries span").textContent = tries;
  }
}
function shuffle(array) {
  let current = array.length;
  let random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    [array[current], array[random]] = [array[random], array[current]];
  }
  return array;
}
function showResults() {
  blocksContainer.remove();

  const resultCard = document.createElement("div");
  resultCard.className = "results";

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-trophy-star");

  const h3 = document.createElement("h3");

  const playAgainBtn = document.createElement("button");
  playAgainBtn.id = "try-again";

  const btnIcon = document.createElement("i");
  btnIcon.classList.add("fa-regular", "fa-arrow-rotate-right");

  playAgainBtn.append(btnIcon, "Play Again");
  playAgainBtn.addEventListener("click", () => {
    window.location.reload();
  });

  if (tries === 0) {
    h3.innerHTML = "Lose, Try Again Later";
    resultCard.classList.add("lose");
  } else if (blocks.every((block) => block.classList.contains("has-match"))) {
    h3.innerHTML = "Great, You Win";
    resultCard.classList.add("win");
  }
  resultCard.append(icon, h3, playAgainBtn);

  document.body.appendChild(resultCard);
}
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    startBtn.click();
  }
});
