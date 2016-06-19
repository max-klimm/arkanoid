var boardX = document.documentElement.clientWidth-100;// ширина поля
var boardY =document.documentElement.clientHeight-100;//высота поля
var board ={
    h:boardY,
    w:boardX,
    color:color,
    row:bricksRow,
    column:bricksColumn,

    drawPole:
        function(ctx){

            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.rect(0, 0, this.w, this.h);
            ctx.closePath();
            ctx.fill()
        }
};//обьект поле

var ballX = 150;//Шар по х
var ballY = 350;//шар по у
var ballSize=5;//Размер шара
var ballDX = 1;//дельта х шара
var ballDY = 1;//дельта у шара

var ball={
    x:ballX,
    y:ballY,
    dx:ballDX,
    dy:ballDY,
    color:color,
    size:ballSize,
    move:function (){
        this.x=this.x+this.dx;//x+=dx
        this.y=this.y+this.dy;//y+=dy
    },
    draw:function(ctx){
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
};//обьект мяч

var paddleX = 5;//доска по х
var paddleH = 10;//высота доски
var paddleY = boardY - paddleH;//доска по У=высота поля-высота доски
var paddleW = 300;//длинна доски
var speedPaddle=25;//скорость доски

var paddle ={
    x:paddleX,
    y:paddleY,
    h:paddleH,
    w:paddleW,
    speed:speedPaddle,
    draw:function (ctx){
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.closePath();
        ctx.fill();
    },
    moveLeft: function(board){
        this.x =this.x - this.speed;
        if (this.x < 0)
            this.x=0;
    },
    moveRight: function(board){
        this.x = this.x + this.speed;
        if (this.x >board.w - this.w)
            this.x = board.w - this.w;

    }
};//обьект ракетка

var bricksRow=8;//Кирпичей в ряду
var bricksColumn=2;//рядов кирпичей
var distanceBetweenX=50;//между кирпичами по Х
var distanceBetweenY=20;//между кирпичами по Y
var brickW=(boardX-(distanceBetweenX*bricksRow))/bricksRow;//длинна кирпича
var brickH=100;//Высота кирпича
var bricks=[];//массив кирпичей

var bonusDY = 1;//Скорость бонуса
var probability=2;//вероятность бонусов
var bonuses=[];//массив бонусов

var gameLoop;// старт
var color=randomColor();//случайный цвет из 5
var score=0;//очки за игру
var interval=10;//интервал выполнения

function drawGameCanvas() {
    canvas = document.getElementById("example");
    canvas.width=boardX;
    canvas.height=boardY;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        gameLoop = setInterval(goGoBall, interval);
        window.addEventListener('keydown', whatKey, true);
    }
}
drawGameCanvas();
function createBricks(){
    var x=0;
    var y=0;

    for (var j=1;j<=bricksColumn;j++){
        y=y+distanceBetweenY+ brickH;
        x=-brickW;
        for(var i=1;i<=bricksRow;i++){
            x=x+distanceBetweenX+brickW;
            var oneBrick=new Brick(x,y);
            bricks.push(oneBrick);
        }
    }
}
createBricks();
function random(min,max) {
    var randSize = min + Math.random() * (max - min );
    randSize = Math.round(randSize);
    return randSize;}
function randomColor(){
    var namberColor=random(1,5);

    if(namberColor==1)
        return 'green';
    if(namberColor==2)
        return 'red';
    if(namberColor==3)
        return 'blue';
    if(namberColor==4)
        return 'orange';
    if(namberColor==5)
        return 'black';
}
function clear(){
    ctx.clearRect(0, 0, board.h, board.w);}
function Brick(x,y){
    this.x=x;
    this.y=y;
    this.w=brickW;
    this.h=brickH;
    this.color=randomColor();
    this.drawing=true;
    this.bonus= getBonus();
    function getBonus(){
        var randomBonusNamber=random(1,probability);
        if(randomBonusNamber==2){
            return true;
        }
        return false;
    }
}
function drawBrick(oneBrick) {
    if(oneBrick.drawing==true){
        ctx.fillStyle = oneBrick.color;
        ctx.beginPath();
        ctx.rect(oneBrick.x,oneBrick.y,oneBrick.w,oneBrick.h);
        ctx.closePath();
        ctx.fill();
    }
}
function drawBricks(){
    for (var i=0; i<bricks.length;i++){
        drawBrick(bricks[i]);
    }
}
function Bonus(bonusX,bonusY){
    this.x=bonusX;
    this.y=bonusY;
    this.dy=bonusDY;
    this.draw=function(ctx){
        ctx.beginPath();
        ctx.arc(this.x,this.y,25,0,Math.PI*2,true); // Внешняя окружность
        ctx.moveTo(this.x+15,this.y,5,75);
        ctx.arc(this.x,this.y,15,0,Math.PI,false);  // рот (по часовой стрелке)
        ctx.moveTo(this.x-10,this.y-10);
        ctx.arc(this.x-10,this.y-10,3,0,Math.PI*2,true);  // Левый глаз
        ctx.moveTo(this.x+5,this.y-10);
        ctx.arc(this.x+10,this.y-10,3,0,Math.PI*2,true);  // Правый глаз
        ctx.stroke();
    };
    this.move=function () {
        this.y = this.y + this.dy;//y+=dy
        if (this.y== paddle.y) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.w) {
                paddle.w=paddle.w+100;
                //alert("bonus");
            }
            else
             {
                 paddle.w=paddle.w-100;
                 //alert("No bonys");
            }
        }
    }
}
function drawBonuses(){
    for(i=0;i<bonuses.length;i++){
        bonuses[i].draw(ctx);
        bonuses[i].move();

    }
}
function goGoBall(){
    clear();
    board.drawPole(ctx);
    drawBricks();
    ball.draw(ctx);
    paddle.draw(ctx);
    moveBall();
    drawBonuses();

}
function moveBall(){
    ball.move();

    if (ball.x+ ball.size > board.w){
        ball.dx = -ball.dx;
        color=randomColor();
    }
    if (ball.x - ball.size < 0){
        ball.dx = -ball.dx;
        color=randomColor();
    }
    if (ball.y - ball.size < 0) {
        ball.dy = -ball.dy;
        color=randomColor();
    }
    if (ball.y+paddle.h + ball.size > board.h ) {

        if( ball.x > paddle.x &&ball.x<paddle.x+paddle.w ){
            ball.dy = -ball.dy;
            //ball.dx=-ball.dx;
            color=randomColor();
        }
    }
    for(var i=0;i<bricks.length;i++){
        var jump=moveOneBrick(bricks[i]);

        if (jump==true){
            if (bricks[i].bonus==true){
               var bonus = new Bonus(bricks[i].x,bricks[i].y);
                bonuses.push(bonus);
                bonus.draw(ctx);

            }
              score++;
            if(bricks[i].color==color){
             score=score+10;
            }
            break;
        }
    }
    if (ball.y>board.h){
       gameOver();
    }

}
function gameOver(){
    clearInterval(gameLoop);
    alert("Game over");
}
function moveOneBrick(oneBrick) {
    ball.x = Math.round(ball.x);
    ball.y = Math.round(ball.y);
    if ((ball.y - ball.size == oneBrick.y + oneBrick.h || ball.y + ball.size == oneBrick.y) && oneBrick.drawing == true) {
        if (ball.x + ball.size > oneBrick.x) {
            if (ball.x + ballSize < oneBrick.x + oneBrick.w) {
                ball.dy = -ball.dy;
                oneBrick.drawing = false;
                return true;
            }
        }
    }
    if ((ball.x + ball.size == oneBrick.x || ball.x - ball.size == oneBrick.x + oneBrick.w) && oneBrick.drawing == true) {
        if (ball.y - ball.size < oneBrick.y + oneBrick.h) {
            if (ball.y + ball.size > oneBrick.y) {
                ball.dx = -ball.dx;
                oneBrick.drawing = false;
                return true;
            }
        }
    }
}
function whatKey(evt) {
        switch (evt.keyCode) {
            case 37:
                paddle.moveLeft(board);
                break;
            case 39:
                paddle.moveRight(board);
                break;
        }
    }





