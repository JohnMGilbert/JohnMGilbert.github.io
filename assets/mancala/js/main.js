// Initial Mancala Board State
let board = [4, 4, 4, 4, 4, 4, 0,  // Player 1
    4, 4, 4, 4, 4, 4, 0]; // Player 2

let currentPlayer = 1; // 1 or 2

// Render the board
function updateBoard() {
    document.querySelectorAll(".pit, .store").forEach((pit) => {
        let index = parseInt(pit.dataset.index);
        pit.innerHTML = ""; // Clear previous contents

        let pitRadius = pit.clientWidth / 2; // Get pit radius for positioning

        for (let i = 0; i < board[index]; i++) {
            let bead = document.createElement("img");
            bead.src = "assets/gem.png"; 
            bead.classList.add("bead");

            // Generate a random angle and distance within the pit bounds
            let angle = Math.random() * 2 * Math.PI; // Random angle (0 to 360 degrees)
            let distance = Math.random() * (pitRadius - 4); // Random distance from center, leaving margin

            let offsetX = Math.cos(angle) * distance - 5;
            let offsetY = Math.sin(angle) * distance;
            bead.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            pit.appendChild(bead);
        }
    });

    // Update store totals
    document.getElementById("player1-store-total").textContent = `Player 1: ${board[6]}`;
    document.getElementById("player2-store-total").textContent = `Player 2: ${board[13]}`;

    console.log("Board State Updated:", board);
}




// Handle pit click
function handlePitClick(event) {
    let gameStatus = document.getElementById("game-status");
    let pit = event.target.closest(".pit"); // Ensure we're clicking a pit

    if (!pit) {
        console.error("Clicked element is not a pit.");
        return;
    }

    let index = parseInt(pit.dataset.index);
    console.log(`Clicked on pit: ${index}, Current Player: ${currentPlayer}, Stones in pit: ${board[index]}`);

    // Ensure index is valid
    if (isNaN(index) || index < 0 || index > 13) {
        console.error("Invalid pit index:", index);
        return;
    }

    // Prevent clicking opponent's pits or empty pits
    if ((currentPlayer === 1 && index > 5) || (currentPlayer === 2 && index < 7)) {
        console.warn("Invalid move: You clicked your opponent's pit.");
        return;
    }
    if (board[index] === 0) {
        console.warn("Invalid move: Pit is empty.");
        return;
    }

    let stones = board[index];
    board[index] = 0;
    console.log(`Picked up ${stones} stones from pit ${index}`);

    let i = index;
    while (stones > 0) {
        i = (i + 1) % 14;

        // Skip opponent's store
        if ((currentPlayer === 1 && i === 13) || (currentPlayer === 2 && i === 6)) {
            continue;
        }

        board[i]++;
        stones--;
        console.log(`Dropped stone in pit ${i}, Stones remaining: ${stones}`);
    }

    // Ensure last stone lands correctly
    if (currentPlayer === 1 && i >= 0 && i <= 5 && board[i] === 1) { // Player 1 lands on empty pit
        let oppositePit = 12 - i;
        let capturedStones = board[oppositePit];

        if (capturedStones > 0) {
            board[6] += capturedStones + 1;
            board[i] = 0;
            board[oppositePit] = 0;
            console.log(`Captured ${capturedStones} stones from pit ${oppositePit} to Player 1's store.`);
        }
    }

    if (currentPlayer === 2 && i >= 7 && i <= 12 && board[i] === 1) { // Player 2 lands on empty pit
        let oppositePit = 12 - i;
        let capturedStones = board[oppositePit];

        if (capturedStones > 0) {
            board[13] += capturedStones + 1;
            board[i] = 0;
            board[oppositePit] = 0;
            console.log(`Captured ${capturedStones} stones from pit ${oppositePit} to Player 2's store.`);
        }
    }

    // Change turn unless last stone landed in the player's store
    if (!((currentPlayer === 1 && i === 6) || (currentPlayer === 2 && i === 13))) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        gameStatus.innerHTML = "Player " + currentPlayer + "'s Turn";
        console.log(`Turn changed: Now Player ${currentPlayer}'s turn.`);
    }

    updateBoard();

    // Check win condition
    if (checkWinCondition()) {
        document.getElementById("debug").innerHTML = "GAME OVER";
        console.log("Game over detected.");
    }
}


function handleMouseEnter(event) {
    let index = parseInt(event.target.dataset.index);

    event.target.classList.add("moused-over-highlight");

    // Create tooltip element if not already present
    let tooltip = document.createElement("div");
    tooltip.classList.add("bead-tooltip");
    tooltip.textContent = board[index];
    document.body.appendChild(tooltip);

    // Position the tooltip above the hovered pit
    let rect = event.target.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 20}px`;

    // Store the tooltip reference in the element
    event.target.tooltip = tooltip;

    
    // Only highlight valid pits (player's own side, not empty)
    if ((currentPlayer === 1 && index > 5) || (currentPlayer === 2 && index < 7) || board[index] === 0) {
        return;
    }

    let stones = board[index];
    let i = index;
    let visitedPits = [];

    // Simulate stone distribution
    while (stones > 0) {
        i = (i + 1) % 14;

        // Skip opponent's store
        if ((currentPlayer === 1 && i === 13) || (currentPlayer === 2 && i === 6)) {
            continue;
        }

        visitedPits.push(i);
        stones--;
    }

    // Apply highlight to all affected pits
    visitedPits.forEach((pitIndex, idx) => {
        let pitElement;

        // Check if the index corresponds to a store or a pit
        if (pitIndex === 6) {
            pitElement = document.getElementById("store1"); // Player 1's store
        } else if (pitIndex === 13) {
            pitElement = document.getElementById("store2"); // Player 2's store
        } else {
            pitElement = document.querySelector(`.pit[data-index="${pitIndex}"]`);
        }

        if (pitElement) {
            if (idx === visitedPits.length - 1) {
                pitElement.classList.add("final-highlight"); // Final drop location (distinct color)
            } else {
                pitElement.classList.add("highlight"); // Normal pit highlight
            }
        }
    });
}


// Remove highlights when mouse leaves the pit
function handleMouseLeave() {
    document.querySelectorAll(".pit").forEach(pit => {
        pit.classList.remove("moused-over-highlight");
    });
    
    document.querySelectorAll(".pit, .store").forEach(pit => {
        pit.classList.remove("highlight", "final-highlight");
    });
    if (event.target.tooltip) {
        event.target.tooltip.remove();
        event.target.tooltip = null;
    }
}

// Attach event listeners to all pits
document.querySelectorAll(".pit").forEach(pit => {
    pit.addEventListener("mouseenter", handleMouseEnter);
    pit.addEventListener("mouseleave", handleMouseLeave);
});


function checkWinCondition() {
    // Check if Player 1's side (pits 0-5) is empty
    let player1Empty = board.slice(0, 6).every(pit => pit === 0);
    // Check if Player 2's side (pits 7-12) is empty
    let player2Empty = board.slice(7, 13).every(pit => pit === 0);

    if (player1Empty || player2Empty) {
        // Move remaining stones to the respective player's store
        let player1Remaining = board.slice(0, 6).reduce((a, b) => a + b, 0);
        let player2Remaining = board.slice(7, 13).reduce((a, b) => a + b, 0);

        board[6] += player1Remaining;  // Add Player 1's remaining stones to their store
        board[13] += player2Remaining; // Add Player 2's remaining stones to their store

        // Empty all pits
        board.fill(0, 0, 6);  // Empty Player 1 pits (0-5)
        board.fill(0, 7, 13); // Empty Player 2 pits (7-12)

        updateBoard();

        // Determine the winner
        let winner;
        if (board[6] > board[13]) {
            winner = "Player 1 Wins!";
        } else if (board[13] > board[6]) {
            winner = "Player 2 Wins!";
        } else {
            winner = "It's a tie!";
        }

        document.getElementById("game-status").innerHTML = winner;
        console.log("Game Over:", winner);

        // Disable further clicks to prevent additional moves
        document.querySelectorAll(".pit").forEach(pit => {
            pit.removeEventListener("click", handlePitClick);
        });

        return true; // Game has ended
    }
    return false; // Game is still ongoing
}


// Attach event listeners
document.querySelectorAll(".pit").forEach(pit => {
    pit.addEventListener("click", handlePitClick);
});

updateBoard();


document.getElementById("rulesButton").addEventListener("click", function () {
    let rulesDiv = document.getElementById("rules");
    if (rulesDiv.classList.contains("hidden")) {
        rulesDiv.classList.remove("hidden");
        this.textContent = "Hide Rules";
    } else {
        rulesDiv.classList.add("hidden");
        this.textContent = "Show Rules";
    }
});


const pitPositions = [
    { x: 94, y: 150 }, { x: 163, y: 150 }, { x: 233, y: 150 },
    { x: 303, y: 150 }, { x: 373, y: 150 }, { x: 442, y: 150 },// { x: 503, y: 70 }, // store, positioned later
    { x: 442, y: 39 }, { x: 373, y: 39 }, { x: 303, y: 39 },
    { x: 233, y: 39 }, { x: 163, y: 39 }, { x: 94, y: 39 }//, { x: 14, y: 70 } // store
];

function updatePitPositions() {
    const board = document.getElementById("board-image");
    const boardRect = board.getBoundingClientRect();
    const scaleFactor = boardRect.width / 600; // Adjust based on original board width

    document.querySelectorAll(".pit").forEach((pit, index) => {
        pit.style.left = ((pitPositions[index].x -1)* scaleFactor) + "px";
        pit.style.top = ((pitPositions[index].y - 16)* scaleFactor) + "px";
    });

    // Position Stores
    document.getElementById("store2").style.left = (9 * scaleFactor) + "px";
    document.getElementById("store2").style.top = (50 * scaleFactor) + "px";

    document.getElementById("store1").style.left = (497 * scaleFactor) + "px";
    document.getElementById("store1").style.top = (50 * scaleFactor) + "px";
}

window.onload = updatePitPositions;
window.onresize = updatePitPositions;

