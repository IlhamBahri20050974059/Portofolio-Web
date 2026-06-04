const board = document.getElementById("board");
const overlay = document.getElementById("overlay");

const turnText = document.getElementById("turn");
const diceBox = document.getElementById("dice");

const rollBtn = document.getElementById("rollBtn");
const restartBtn = document.getElementById("restartBtn");

const historyBox = document.getElementById("history");

const pos1Text = document.getElementById("pos1");
const pos2Text = document.getElementById("pos2");

const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");

const diceFaces = ["⚀","⚁","⚂","⚃","⚄","⚅"];

const ladders = {
    4: 25,
    13: 46,
    33: 49,
    42: 63,
    50: 69,
    62: 81
};

const snakes = {
    97: 78,
    88: 24,
    76: 58,
    67: 45,
    54: 34,
    39: 18
};

let p1 = 1;
let p2 = 1;

let currentPlayer = 1;
let gameOver = false;

function createBoard(){

    board.innerHTML = "";

    let rows = [];

    for(let row=0; row<10; row++){

        let current = [];

        for(let col=1; col<=10; col++){

            current.push(row*10+col);
        }

        if(row % 2 === 1){
            current.reverse();
        }

        rows.unshift(current);
    }

    rows.flat().forEach(num=>{

        const cell = document.createElement("div");

        cell.className = "cell";
        cell.id = `cell-${num}`;

        cell.innerHTML =
        `<span class="number">${num}</span>`;

        board.appendChild(cell);
    });

    drawPlayers();

    setTimeout(drawConnections,100);
}

function drawPlayers(){

    document
    .querySelectorAll(".player")
    .forEach(el=>el.remove());

    addPlayer(p1,"player1");
    addPlayer(p2,"player2");

    pos1Text.textContent = p1;
    pos2Text.textContent = p2;
}

function addPlayer(pos,className){

    const cell = document.getElementById(`cell-${pos}`);

    if(!cell) return;

    const piece = document.createElement("div");

    piece.className = `player ${className}`;

    cell.appendChild(piece);
}

function getCenter(num){

    const cell = document.getElementById(`cell-${num}`);

    const boardRect =
        board.getBoundingClientRect();

    const rect =
        cell.getBoundingClientRect();

    return {
        x: rect.left-boardRect.left+rect.width/2,
        y: rect.top-boardRect.top+rect.height/2
    };
}

function drawConnections(){

    overlay.innerHTML="";

    Object.entries(snakes).forEach(([from,to])=>{

        const a=getCenter(+from);
        const b=getCenter(+to);

        const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1",a.x);
        line.setAttribute("y1",a.y);

        line.setAttribute("x2",b.x);
        line.setAttribute("y2",b.y);

        line.setAttribute(
            "class",
            "snake-line"
        );

        overlay.appendChild(line);
    });

    Object.entries(ladders).forEach(([from,to])=>{

        const a=getCenter(+from);
        const b=getCenter(+to);

        const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1",a.x);
        line.setAttribute("y1",a.y);

        line.setAttribute("x2",b.x);
        line.setAttribute("y2",b.y);

        line.setAttribute(
            "class",
            "ladder-line"
        );

        overlay.appendChild(line);
    });
}

function sleep(ms){

    return new Promise(resolve=>{

        setTimeout(resolve,ms);

    });
}

function addHistory(text){

    const div =
    document.createElement("div");

    div.textContent = text;

    historyBox.prepend(div);
}

async function animateDice(){

    for(let i=0;i<10;i++){

        const n =
        Math.floor(Math.random()*6);

        diceBox.textContent =
        diceFaces[n];

        await sleep(80);
    }
}

async function move(player,dice){

    let pos = player===1 ? p1 : p2;

    if(pos + dice > 100){

        addHistory(
            `Player ${player} butuh angka pas ke 100`
        );

        return;
    }

    for(let i=0;i<dice;i++){

        pos++;

        if(player===1){
            p1 = pos;
        }else{
            p2 = pos;
        }

        drawPlayers();

        await sleep(250);
    }

    if(ladders[pos]){

        addHistory(
            `🪜 Player ${player}: ${pos} → ${ladders[pos]}`
        );

        pos = ladders[pos];
    }

    if(snakes[pos]){

        addHistory(
            `🐍 Player ${player}: ${pos} → ${snakes[pos]}`
        );

        pos = snakes[pos];
    }

    if(player===1){
        p1 = pos;
    }else{
        p2 = pos;
    }

    drawPlayers();

    if(pos===100){

        gameOver = true;

        turnText.innerHTML =
        `🏆 Player ${player} Menang!`;

        rollBtn.disabled = true;
    }
}

rollBtn.addEventListener(
"click",
async()=>{

    if(gameOver) return;

    rollBtn.disabled=true;

    await animateDice();

    const dice =
    Math.floor(Math.random()*6)+1;

    diceBox.textContent =
    diceFaces[dice-1];

    addHistory(
        `🎲 Player ${currentPlayer} mendapatkan ${dice}`
    );

    await move(
        currentPlayer,
        dice
    );

    if(!gameOver){

        currentPlayer =
        currentPlayer===1 ? 2 : 1;

        turnText.innerHTML =
        `Giliran Player ${currentPlayer}`;

        card1.classList.toggle(
            "active",
            currentPlayer===1
        );

        card2.classList.toggle(
            "active",
            currentPlayer===2
        );
    }

    rollBtn.disabled=false;
});

restartBtn.addEventListener(
"click",
()=>{

    p1=1;
    p2=1;

    currentPlayer=1;

    gameOver=false;

    diceBox.textContent="⚀";

    historyBox.innerHTML="";

    turnText.innerHTML=
    "Giliran Player 1";

    card1.classList.add("active");
    card2.classList.remove("active");

    rollBtn.disabled=false;

    createBoard();
});

window.addEventListener(
"resize",
()=>setTimeout(drawConnections,100)
);

createBoard();