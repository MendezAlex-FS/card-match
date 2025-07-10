// Imports your SCSS stylesheet
import "@/styles/index.scss";

type Card = {
    id: number;
    value: string;
    matched: boolean;
    element: HTMLElement;
    // Need a click handler as we are removing the handler
    // Can't use arrow functions when removing handlers.
    clickHandler: () => void;
};

let cards: Card[] = [];
let turnedCards: Card[] = [];
let tries = 3;

function shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
}

function compareCards(): void {
    const [firstCard, secondCard] = turnedCards;

    if (firstCard.value === secondCard.value) {
        firstCard.matched = true;
        secondCard.matched = true;
    } else {
        firstCard.element.classList.remove("flipped");
        secondCard.element.classList.remove("flipped");
        tries--;
        document.querySelector("#tries-left")!.textContent = `Attempts Left: ${tries}`;
        if (tries === 0) {
            document.querySelector("#results")!.textContent = "Game Over!";
            disableAllCards();
        }
    }

    turnedCards = [];

    if (cards.every(card => card.matched)) {
        document.querySelector("#results")!.textContent = "You Won!";
    }
}

function flipCard(index: number): void {
    const card = cards[index];
    if (card.matched || turnedCards.includes(card)) return;

    card.element.classList.add("flipped");
    turnedCards.push(card);

    if (turnedCards.length === 2) {
        setTimeout(compareCards, 600);
    }
}

function startGame(): void {
    // There will be a total of six (6) cards flipped face down at the start.
    const values = shuffle(["A", "A", "M", "M", "C", "C"]);
    const board = document.querySelector("#game-board")!;
    board.innerHTML = "";
    turnedCards = [];

    // Find all sets of matching cards within a maximum of 3 tries/attempts
    tries = 3;
    document.querySelector("#tries-left")!.textContent = `Attempts Left: ${tries}`;
    document.querySelector("#results")!.innerHTML = "&nbsp;";

    // Create the cars
    cards = values.map((value, index) => {
        const card = document.createElement("article");
        card.className = "card";

        // This structure is for the flip effect
        card.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">${value}</div>
        </div>
        `;

        const handler = () => flipCard(index);
        card.addEventListener("click", handler);
        board.appendChild(card);

        return { id: index, value, matched: false, element: card, clickHandler: handler };
    });
}

function disableAllCards(): void {
    cards.forEach(card => {
        card.element.removeEventListener("click", card.clickHandler);
    });
}

// Start the game on load.
window.onload = startGame;

// Bind the restart game button
const restartGame = document.querySelector("#restart-game");
restartGame?.addEventListener("click", () => { startGame(); });