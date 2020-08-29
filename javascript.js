//variables..............

var playing=false;
var start=document.querySelector("#start");
var timeremaining=document.querySelector("#timevalue");
var timeBox=document.querySelector('#time');
var countdownTimer=document.querySelector("#time");
var gameOver=document.querySelector('#gameover');
var squares=document.querySelectorAll('.box');
var scoreBox=document.querySelector('#scorevalue');
var xContainer=document.querySelector('#x');
var yContainer=document.querySelector('#y');
var instructionBox=document.querySelector('#instruction');
var gameOverScore=document.querySelector('#gameoverscore');
var highScoreValue=document.querySelector('#highScoreValue');
var correct=document.querySelector('#correct');
var wrong=document.querySelector('#wrong');
var operator=document.querySelector('#operator');
var modes=document.querySelectorAll('.mode');
var currentMode=document.querySelector('.selected');
var highScore=0;
var correctAnswer;
var time=60;
var score=0;
var upperLimit=30;
var timer;
var mode="Easy";
// upperLimit=prompt("Enter UpperLimit >20");
// upperLimit=upperLimit>20?upperLimit:50;
var highScores={
	"Easy":0,
	"Medium":0,
	"Hard":0
};

var operatorsList={
	1:"+",
	2:"-",
	3:"x",
	4:"%"
};
if(localStorage.getItem('highScores')!==null)		//before starting the game show highscore
	{
		 highScores=JSON.parse(localStorage.getItem('highScores'));
		console.log(highScores[currentMode.innerHTML]);
		
	}
else
{
	localStorage.setItem('highScores',JSON.stringify(highScores));
}
console.log(highScores,"outside");
highScoreValue.innerHTML=highScores["Easy"];

//functions............................



function startGame()	//Funtion that starts the game
{	time=60;
	score=0;
	scoreBox.innerHTML=score
	if(localStorage.getItem('highScores')!==null)
	{
		highScores=JSON.parse(localStorage.getItem('highScores'));
		highScoreValue.innerHTML=highScores[mode];
	}
	if(playing==true)	//if we are playing then reset
	{	
		location.reload();

		playing=false;
	}
	// console.log(highScore);

if(playing==false)//if we are not playing then start
{	showSquares();
	newQuestion();
	hide(gameOver);
	show(instructionBox);
	showSpan(xContainer);
	showSpan(yContainer);
	showSpan(operator);
	start.innerHTML="Reset Game";
	playing=true;
	timeremaining.innerHTML=time;
	show(countdownTimer);		//display counter
	
	startcounter(time);

}
}
function refresh()
{
	hideSquares();
	hide(instructionBox);
	hide(xContainer);
	hide(yContainer);
	hide(operator);
	hide(countdownTimer);
	playing=false;
	start.innerHTML="Start Game";
	clearInterval(timer);


}
function showSpan(span)
{
	span.style.display="inline"

}

function showSquares()			//unhides the squares when beginning the game
{
	for(let i=0;i<4;++i)
	{
		show(squares[i]);
	}
}
function hideSquares()			//hides the square after game over
{
	for(let i=0;i<4;++i)
	{
		hide(squares[i]);
	}
}
function show(id)				//helper function to show elements
{
	id.style.display="block";

}	
function hide(id)				//helper function to hide elements
{
	id.style.display="none";
}
function stopGame()				// display game over and hide squares
{
	gameOver.style.display="block";
	gameOverScore.innerHTML=score;
	hide(countdownTimer);
	hideSquares();
	
	start.innerHTML="Start New Game";
	playing=false;
	if(score>highScore)
	{
		highScore=score;
		highScores[mode]=highScore;
		console.log("after game over"+highScores);
		localStorage.setItem('highScores',JSON.stringify(highScores));
		highScoreValue.innerHTML=highScore;
	}
	
	// console.log(highScore);

}
function startcounter(time)		//start the Timer
{
	 timer=setInterval(function()
	{
		time--;					//decrement Timer value
		timeremaining.innerHTML=time;
		if(time==0)						// If remaining Time is 0
		{	
			clearInterval(timer);
			stopGame();
		}
	},1000);
}


function generateRandomAnswers(val)		//helper Function to generate Random answers
{
	let ans=new Set();
	ans.add(val);
	if(val<=5) 
		val=50;
	while(ans.size!=4)
	{
		ans.add(Math.floor((Math.random()*val)+(0.5*val)));
	}
	// console.log(ans);
	ans=[...ans]
	// console.log(ans);
	return ans;
}


function newQuestion()					//generate a new Question
{	let x,y,op,rand;
	//hide crct and wrong
	hide(wrong);
	hide(correct);

	//generate question
	x=Math.floor(Math.random()*upperLimit+0.45*upperLimit);
	y=Math.floor(Math.random()*upperLimit+0.45*upperLimit);
	rand=Math.floor(Math.random()*4+1);
	if(x<y)
	{
		[x,y]=[y,x];
	}
	
	op=operatorsList[rand];
	switch(rand)
	{
		case 1: {
				correctAnswer=x+y;
				break;
				}	
		case 2: {
				correctAnswer=x-y;
				break;
				}	
		case 3: {
				correctAnswer=x*y;
				break;
				}	
		case 4: {
				correctAnswer=x%y;
				break;
				}	
	}
	 
	 //generate Random answers
	let ans=generateRandomAnswers(correctAnswer);
	ans.push(correctAnswer);

	//display the question
	xContainer.innerHTML=x;
	operator.innerHTML=op
	yContainer.innerHTML=y;

	//assign the options
	let crctIndex=assignOptions(ans);
	
}

function assignOptions(ans)				//assign the random answers to the squares
{
	let crctIndex=Math.floor(Math.random()*4);
	squares[crctIndex].innerHTML=ans[0];
	for(let i=3,j=0;j<4;++j)
	{
		if(j==crctIndex)
			continue;
		squares[j].innerHTML=ans[i];
		--i;
	}
}	
function check()						// check whether the selected square is correct
{
	if(this.innerHTML==correctAnswer)
		{
			show(correct);
			score++;
			scoreBox.innerHTML=score;
			newQuestion();
			if(score>highScore)
			{
				highScore=score;
				highScores[mode]=highScore;
				console.log("in check"+JSON.stringify(highScores));
				localStorage.setItem('highScores',JSON.stringify(highScores));
				highScoreValue.innerHTML=highScore;
				// console.log(highScore);
			}
	

		}
	else
		{	// if selected answer is wrong
			show(wrong);
			setTimeout(function(){hide(wrong);},500);

		}
}
function changeMode(mode)
{	
	if(mode=="Easy")
		upperLimit=30;
	else if(mode=="Medium")
		upperLimit=60;
	else
		upperLimit=100;
	// console.log(upperLimit);
	// startGame();


	refresh();
}
// Event Listeners.....................


start.onclick=startGame; //Start Game


for(let i=0;i<4;++i)				//add EventListeners to squares
{
	squares[i].addEventListener("click",check);
}
for (var i =modes.length - 1; i >= 0; i--) {
	modes[i].addEventListener('click',function(){
		 currentMode=document.querySelector('.selected');
		 // console.log(currentMode);
		if(this!=currentMode)
		{	changeMode(this.innerHTML);
			currentMode.classList.remove('selected')
			this.classList.add('selected');
			currentMode=document.querySelector('.selected');	
			mode=currentMode.innerHTML;
			highScore=highScores[mode];
			highScoreValue.innerHTML=highScore;
		}
		});
}
	