var scores = [1,1,1,1];
var players = 1;
var whosTurn = 1;
var cardScore;


/*
	When the page loads, this message will display
*/
window.onload = function myFunc(){
	$("#frame").css({float: 'none', margin: 'auto'});
	$("#frame").css({visibility: 'hidden'});
	$("#move-player-wrapper").css({visibility: 'hidden'});
	document.getElementById('game-rules').innerHTML=`
		<h1> Let's play a boardgame!</h1>
		<ol id ="rules-list">
			<li>You start on space #1.  The goal is to reach space #32.</li>
			<li>You control the game. </li>
			<li>Every turn, you draw a card.</li>
			<li>The card tells you what to do.</li>
			<li>You do it.</li>
			<li>If you and your fellow players don't like the card, get a new one.</li>
			<li>You adjust the player spaces.</li>
			<li>USERS submit the cards. </li>
			<li>Upvote cards you like.</li>
			<li>Downvote cards you hate.</li>
			<li>Have fun!</li>
		</ol>
		<br>
		<button id="play-button" onclick="gameplay()">Continue</button>
	`;
};

function getCardAjax(getCardCallBack){
	$.ajax({url: "/card", success: function(cardData){
		getCardCallBack(cardData);
	}});
};
function updateCardScoreAjax(cardID,score,updateScoreCallBack){
	var idObj = {"cardID":cardID};
	if(score == 1){
		$.ajax({
			url: "/upvote", 
			type: "post",
			data: "cardID="+cardID,
			success: function(cardData){
			updateScoreCallBack(cardData);
		}});
	}else if (score == -1){
		$.ajax({
			url: "/downvote", 
			type: "post",
			data: "cardID="+cardID,
			success: function(cardData){
			updateScoreCallBack(cardData);
		}});
	}
};

function replaceSubstring(inSource, inToReplace, inReplaceWith) {

  var outString = inSource;
  while (true) {
    var idx = outString.indexOf(inToReplace);
    if (idx == -1) {
      break;
    }
    outString = outString.substring(0, idx) + inReplaceWith +
      outString.substring(idx + inToReplace.length);
  }
  return outString;

}
function drawAnother(){
	var score = parseInt(document.getElementById("card-upvote-score").innerHTML);
	var id = parseInt(document.getElementById("card-id").innerHTML);
	getCardAjax(function(output){
		output.title = escapeCharacters(output.title);
		output.scenario = escapeCharacters(output.scenario);
		$("#card-scenario").html(output.scenario);
		$("#card-title").html(output.title);
		$("#card-score").html(output.score); 
		$("#card-id").html(output.cardID);
		cardScore = output.score;
	});
	updateCardScoreAjax(id,score,function(output){
	});
	document.getElementById('card-upvote-score').innerHTML=0;
};



function escapeCharacters(string){
    return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;').replace(/\//g,'&#x2F'); 
};




function drawCard(){
	var score = parseInt(document.getElementById("card-upvote-score").innerHTML);
	var id = parseInt(document.getElementById("card-id").innerHTML);
	document.getElementById('whos-card').innerHTML="Card for Player: " + whosTurn;
	whosTurn++;
	if(whosTurn == 5)
		whosTurn = 1;
	document.getElementById('draw-new').innerHTML="Draw Card for Player " + whosTurn + ".";
	getCardAjax(function(output){
		output.title = escapeCharacters(output.title);
		output.scenario = escapeCharacters(output.scenario);
		$("#card-scenario").empty();
		$("#card-title").empty();
		$("#card-scenario").html(output.scenario);
		$("#card-title").html(output.title);
		$("#card-score").html(output.score); 
		$("#card-id").html(output.cardID);
		cardScore = output.score;
	});
	updateCardScoreAjax(id,score,function(output){
	});
	document.getElementById('card-upvote-score').innerHTML=0;
};


function gameplay(){
	$("#frame").css({float: 'left'});
	$("#frame").css({visibility: 'visible'});
	$("#game-rules").css({visibility: 'hidden'});
	$("#game-rules").css({width: '0px', height: '0px'});
	$("#game-rules").html("");
	$("#move-player-wrapper").css({visibility: 'visible'});
	$("#wrapper").css({"margin": "none", "width":"100%","height":"100%"});
	/*
	Setup board
	*/
	document.getElementById('game-content').innerHTML=`
			<!--<div id="center-header"><h1>ENJOY!</h1></div>-->
			<div id="card-data">
				<p id="whos-card"></p>
				<p id="card-title">Draw a card to begin!</p>
				<p id="card-scenario"></p>
			</div>
			<div id="card-voting">
				<div onclick="upvote()" id="card-upvote"></div>
				<div id="card-score"></div>
				<div onclick="downvote()" id="card-downvote"></div>
				<div id="card-id"></div>
				<div id="card-upvote-score">0</div>
			</div>

			<button class = "draw-button" id="draw-another" onclick="drawAnother()">This card sucks, get me a new one.</button>
			<button class = "draw-button" id="draw-new" onclick="drawCard()">Draw Card for Player 1.</button>
	`;
	for(i = 1; i <= 4; i++){
		document.getElementById("move-player-wrapper").innerHTML += `
			<div class="player-scorecard">
			<p>Player ` + i + `</p>
			<div onclick="forward(` + i + `)"class="player-forward" id="player-` + i + `-forward">Forward</div>
			<div onclick="back(` + i + `)"class="player-backward" id="player-` + i + `-backward">Back</div>
			</div>
		`;

	}
	for(i = 1; i <= 9; i++){
		if(i % 2 == 0)
			document.getElementById('top-board-row').innerHTML += `
				<div class="row-space even" id ="space-no-` + i + `"></div>
			`;
		else
			document.getElementById('top-board-row').innerHTML += `
				<div class="row-space odd" id ="space-no-` + i + `"></div>
			`;
	}
	for(i = 10; i <= 16; i++){
		if(i % 2 == 0)
			document.getElementById('right-board-col').innerHTML += `
				<div class="col-space even" id ="space-no-` + i + `"></div>
			`;
		else
			document.getElementById('right-board-col').innerHTML += `
				<div class="col-space odd" id ="space-no-` + i + `"></div>
			`;
	}
	for(i = 25; i >= 17; i--){
		if(i % 2 == 0)
			document.getElementById('bottom-board-row').innerHTML += `
				<div class="row-space even" id ="space-no-` + i + `"></div>
			`;
		else
			document.getElementById('bottom-board-row').innerHTML += `
				<div class="row-space odd" id ="space-no-` + i + `"></div>
			`;
	}
	for(i = 32; i >= 26; i--){
		if(i % 2 == 0)
			document.getElementById('left-board-col').innerHTML += `
				<div class="col-space even" id ="space-no-` + i + `"></div>
			`;
		else
			document.getElementById('left-board-col').innerHTML += `
				<div class="col-space odd" id ="space-no-` + i + `"></div>
			`;
	}
	clearBoard();
	updateBoard();
};



function clearBoard(){
	for(i = 1; i <= 32; i++){
		document.getElementById("space-no-" + i).innerHTML =`<p class="space-no"> ` + i + `</p>`;
	}
	for(i = 0; i < 4; i++){
		var p = i + 1;
		document.getElementById("space-no-" + scores[i]).innerHTML ="";
	}
};



//Go through the scores and put the correct players in the correct place
function updateBoard(){
	for(i = 0; i < 4; i++){
		var p = i + 1;
		document.getElementById("space-no-" + scores[i]).innerHTML += `<div class="piece" id="player-piece-` + p + `"> ` + p + `</div>`;
	}
};



function forward(player){
	//var score = parseInt(document.getElementById("player-" + player + "-score").innerHTML);
	var score = scores[player-1];
	score = score+1;
	if(score == 32){
		document.getElementById('game-content').innerHTML =`<h1>Player ` + player + ` Won!</h1>`;
	}else if (score > 32){
		score = 32;
	}
	scores[player-1] = score; 
	clearBoard();
	updateBoard();
};


function back(player){
	//var score = parseInt(document.getElementById("player-" + player + "-score").innerHTML);
	var score = scores[player-1];
	score = score-1;
	if(score <= 1){
		score = 1;
	}
	scores[player-1] = score; 
	clearBoard();
	updateBoard();
};



function upvote(){
	var score = parseInt(document.getElementById("card-upvote-score").innerHTML);
	if(score == 1)
		score = 1
	if(score == 0)
		score = 1;
	if(score == -1)
		score = 0;
	document.getElementById("card-upvote-score").innerHTML = score;
	document.getElementById("card-score").innerHTML = cardScore + score;
}

function downvote(cardID){
	var score = parseInt(document.getElementById("card-upvote-score").innerHTML);
	if(score == -1)
		score = -1;
	if(score == 0)
		score = -1;
	if(score == 1)
		score = 0
	document.getElementById("card-upvote-score").innerHTML = score;
	document.getElementById("card-score").innerHTML = cardScore + score;
}
