// Memory Spiel mit deiner SamEngine + API Bilder

import {
    createCanvas,
    enableFullscreen,
    setupFullscreenButton,
    renderText,
    startEngine,
    setupInput,
    isKeyJustPressed,
    resetInput,
    dlog,
    Key,
    getMouse,
    Mouse,
    drawRect,
    drawRectOutline
} from "samengine";

import { type Rect, isMouseInRect, isRectClicked, makeRect } from "samengine/types";
import { lerp } from "samengine/utils";

const {
    canvas,
    ctx,
    applyScaling,
    virtualWidth,
    virtualHeight
} = createCanvas({
    fullscreen: true,
    scaling: "fit",
    virtualWidth: window.innerWidth,
    virtualHeight: window.innerHeight
});

setupInput(canvas, virtualWidth, virtualHeight);

enableFullscreen(canvas);
setupFullscreenButton(canvas);

let scrollY = 0;
let scrollSpeed = 25;

// Scroll
canvas.addEventListener("wheel", (e) => {
    scrollY += e.deltaY * scrollSpeed * 0.1;

    if (scrollY < 0) {
        scrollY = 0;
    }
});

// =======================
// API
// =======================

const API_URL =
    "https://script.google.com/macros/s/AKfycbw-MMM3-dojKwi5695KFuv3b-sD_i8BkwhLZuQ7c9N09Efm-29Qo4jyloUUejrSKoV2/exec?sheet=Data";

type Character = {
    name: string;
    picture: string;
};

type MemoryCard = {
    id: number;
    character: Character;
    flipped: boolean;
    matched: boolean;
    image: HTMLImageElement;
    box: Rect;
    scale: number;
};

let cards: MemoryCard[] = [];

// Load the Characters from the API
async function fetchCharacters() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("API Fehler");
    }

    return await response.json();
}

function processCharacters(data: any[]): Character[] {
    const result: Character[] = [];

    data.forEach((row) => {
        const name = (row.Name || "").trim();

        if (!name) return;

        const picture = (row.Picture || "").trim();

        result.push({
            name,
            picture
        });
    });

    return result;
}

// =======================
// Spiel Variablen
// =======================

const cols = 8;
// const rows = 4;

const cardWidth = 140;
const cardHeight = 180;

const gap = 20;

let firstCard: MemoryCard | null = null;
let secondCard: MemoryCard | null = null;

let waiting = false;
let gameStarted = false;
let gameReady = false;
let moves = 0;

let cardCount = 16;

// =======================
// Karten erstellen
// =======================

function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
    
    return array;
}

async function createMemoryCards() {
    const rawData = await fetchCharacters();
    const chars = processCharacters(rawData);

    const selected = shuffle(chars).slice(0, cardCount / 2);

    const pairs = [...selected, ...selected];

    const totalRows = Math.ceil(pairs.length / cols);

    const totalWidth =
        cols * cardWidth + (cols - 1) * gap;

    const totalHeight =
        totalRows * cardHeight + (totalRows - 1) * gap;

    const startX = (canvas.width - totalWidth) / 2;
    const startY = 50;

    const shuffledPairs = shuffle([...pairs]);

    cards = shuffledPairs.map((char, index) => {
        const img = new Image();
        img.src = char.picture;

        const col = index % cols;
        const row = Math.floor(index / cols);

        const x = startX + col * (cardWidth + gap);
        const y = startY + row * (cardHeight + gap);

        return {
            id: index,
            character: char,
            flipped: false,
            matched: false,
            image: img,

            box: {
                x,
                y,
                width: cardWidth,
                height: cardHeight
            },

            scale: 1
        };
    });
}

// =======================
// Kartenlogik
// =======================

function flipCard(card: MemoryCard) {
    if (firstCard && secondCard) return;

    card.flipped = true;

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;

    moves++;

    if (
        firstCard.character.name === secondCard.character.name
    ) {
        firstCard.matched = true;
        secondCard.matched = true;

        firstCard = null;
        secondCard = null;

        dlog("Match!");
    } else {
        waiting = true;

        setTimeout(() => {
            if (firstCard) firstCard.flipped = false;
            if (secondCard) secondCard.flipped = false;

            firstCard = null;
            secondCard = null;

            waiting = false;
        }, 1000);
    }
}

// =======================
// Start
// =======================

async function gameStart() {
    dlog("Memory gestartet");

    cardCount = Number((window as any).__GAMESETTINGS__.cards);
    console.log(Number((window as any).__GAMESETTINGS__.cards));

    await createMemoryCards();

    gameReady = true;
}

// =======================
// Render
// =======================

function drawCard(card: MemoryCard, mouse: Mouse) {

    const x = card.box.x;
    const y = card.box.y - scrollY;

    if (
        y + cardHeight < 0 ||
        y > canvas.height
    ) {
        return;
    }

    const rect = makeRect(x, y, cardWidth, cardHeight);

    const hovered = isMouseInRect(mouse, rect);

    // Smooth Scale Animation
    const targetScale = hovered ? 1.08 : 1;

    card.scale = lerp(card.scale, targetScale, 0.15);

    const w = cardWidth * card.scale;
    const h = cardHeight * card.scale;

    // Mittelpunkt behalten
    const dx = x - (w - cardWidth) / 2;
    const dy = y - (h - cardHeight) / 2;

    // Schatten
    ctx.shadowColor = hovered
        ? "rgba(255,255,255,0.4)"
        : "transparent";

    ctx.shadowBlur = hovered ? 20 : 0;

    // Rückseite
    if (!card.flipped && !card.matched) {
        drawRect(ctx, makeRect(dx, dy, w, h), "#2d2d2d");

        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.strokeRect(dx, dy, w, h);

        renderText(
            ctx,
            "?",
            dx + w / 2 - 10,
            dy + h / 2 - 10,
            "white",
            "48px Arial"
        );

        ctx.shadowBlur = 0;

        return;
    }

    // Vorderseite
    drawRect(ctx, makeRect(dx, dy, w, h), "white");

    ctx.drawImage(card.image, dx + 10, dy + 10, w - 20, h - 50);

    renderText(
        ctx,
        card.character.name,
        dx + 10,
        dy + h - 25,
        "black",
        "16px Arial"
    );

    let color = card.matched ? "lime" : "black";

    drawRectOutline(ctx, makeRect(dx, dy, w, h), color, 3);

    ctx.shadowBlur = 0;
}

// =======================
// Game Loop
// =======================

function gameLoop(dt: number) {
    applyScaling();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isKeyJustPressed(Key.Escape)) {
        gameStarted = !gameStarted;
    }

    // Loading
    if (!gameReady) {
        renderText(
            ctx,
            "Lade Charaktere...",
            50,
            50,
            "white",
            "36px Arial"
        );

        resetInput();
        return;
    }

    // Startscreen
    if (!gameStarted) {
        renderText(
            ctx,
            "MEMORY",
            50,
            60,
            "white",
            "48px Arial"
        );

        renderText(
            ctx,
            "Drücke ESC zum Starten",
            50,
            120,
            "white",
            "28px Arial"
        );

        renderText(
            ctx,
            "Klicke Karten zum Aufdecken",
            50,
            170,
            "white",
            "24px Arial"
        );

        resetInput();
        return;
    }

    const mouse = getMouse();

    const totalRows = Math.ceil(cards.length / cols);

    const contentHeight =
        totalRows * cardHeight +
        (totalRows - 1) * gap;

    const maxScroll =
        Math.max(0, contentHeight - canvas.height + 100);

    // Clamp Scroll
    if (scrollY < 0) {
        scrollY = 0;
    }

    if (scrollY > maxScroll) {
        scrollY = maxScroll;
    }

    // Karten Klicks
    if (!waiting) {
        cards.forEach((card) => {
            if (card.flipped || card.matched) return;

            const shiftedBox = {
                ...card.box,
                y: card.box.y - scrollY
            };

            if (isRectClicked(mouse, shiftedBox)) {
                flipCard(card);
            }
        });
    }

    cards.forEach((card) => {
        drawCard(card, mouse);
    });

    // UI
    renderText(
        ctx,
        `Moves: ${moves}`,
        20,
        40,
        "yellow",
        "28px Arial"
    );

    renderText(
        ctx,
        `Cards: ${cards.length}`,
        20,
        90,
        "yellow",
        "28px Arial"
    );

    const allMatched = cards.every((c) => c.matched);

    if (allMatched) {
        drawRect(ctx, makeRect(canvas.width / 2 - 160, 60, 480, 130, 40), "black")

        renderText(
            ctx,
            "GEWONNEN!",
            canvas.width / 2 - 120,
            80,
            "lime",
            "64px Arial"
        );

        renderText(
            ctx,
            `Züge: ${moves}`,
            canvas.width / 2 - 80,
            140,
            "white",
            "32px Arial"
        );
    }

    resetInput();
}

// =======================
// Engine Start
// =======================

startEngine(
    () => {
        gameStart().then(() => {
            dlog("Game Ready");
        });
    },
    gameLoop
);
