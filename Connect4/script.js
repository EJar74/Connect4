//Need to import the canvas to manipulate it here.
const canvas = document.getElementById('canvas');
//Actual drawing is done using the CanvasRenderingContext2D interface.
//Can then call all variables and methods on this.
const ctx = canvas.getContext('2d');

canvas.width = 1075;
canvas.height = 718;
ctx.fillStyle = '#3a9fbf';
ctx.fillRect(0,0,canvas.width,canvas.height);

let fill_x = canvas.width / 7;
let fill_y = canvas.height / 6;
let coords = [];
let row_col = [];

for (let i = 0; i < 7; i ++){
    let x = fill_x * i +77;
    for (let j = 0; j < 6; j++){
        let y = fill_y * j +60;
        coords.push([x,y]);
        row_col.push([j,i]);
        ctx.beginPath();
        ctx.arc(x,y,50,0,Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}
coords.reverse();
row_col.reverse();

let board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
];

function innerMove(row, col, color){
    if (!board[row][col]){
        board[row][col] = color;
        return check(row,col,color);
    }
    else{return;}
}

function check(row, col, color,stop=false){
    const modifiers = [[0,1],[0,-1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
    const directions = ["Right","Left","Above","Below","BottomRight","BottomLeft","TopRight","TopLeft"];

    let neighbors = [];
    let positions = [];
    let guide = [];

    for (i in modifiers){
        try{
            if (!(row + modifiers[i][0] < 0 || col + modifiers[i][1] < 0)){
                neighbors.push(board[row + modifiers[i][0]][col + modifiers[i][1]]);
                positions.push([row + modifiers[i][0], col + modifiers[i][1]]);
                guide.push(directions[i]);
            }
        }
        catch{}
    }
    console.log(neighbors);
    console.log(positions);
    console.log(guide);

    for (j in guide){
        let finder = directions.indexOf(guide[j]);
        let result = search(row,col,color,1,modifiers[finder]);
        if (result === 4){
            return "You Won";
        }
    }
    if (stop){return;}

    for (m in positions){
        if (board[positions[m][0]][positions[m][1]] === color){
            let mlk = check(positions[m][0],positions[m][1],color,true);
            if (mlk === "You Won"){
                return mlk;
            }
        }
    }
}

function search(row,col,color,count,mod){
    try{
        if (count === 4){
            return 4;
        }
        let next = board[row + mod[0]][col + mod[1]];
        if (next === color){
            return search(row + mod[0], col + mod[1], color, count+1, mod);
        }
        return count;
    }
    catch{return count;}
}

let RED = true;

function move(e){
    let diff = (window.innerWidth - canvas.width)/2
    for (k in coords){
        if (e.x-diff > coords[k][0] - 50 && e.x-diff < coords[k][0] + 50){

            ctx.beginPath();
            ctx.arc(coords[k][0],coords[k][1],50,0,Math.PI*2);
            ctx.fillStyle= RED ? "red" : "yellow";
            ctx.fill();
            let check = innerMove(row_col[k][0],row_col[k][1], RED ? "red" : "yellow");

            coords.splice(k,1);
            row_col.splice(k,1);
            
            if (check === "You Won"){
                ctx.font = "100px Arial";
                ctx.fillText(`${RED ? "Red" : "Yellow"} wins!`, canvas.width/4, canvas.height/2)
            }

            RED = !RED;
            break;
        }
    }
}

addEventListener("click",move);
