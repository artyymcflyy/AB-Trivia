let questionsList = [
	{
		question: "What is the name of woody's friend that is a dog?",
		choices: ["Campy", "Doggy", "Slinky", "Rex"],
		answer: "Slinky",
		images: ["https://media2.giphy.com/media/26tknCqiJrBQG6bxC/giphy.gif", "http://www.reactiongifs.com/r/wrong-gif.gif"]
	},
	{
		question: "What year did Nickelodeon's 'The Last Airbender' release?",
		choices: ["2009", "2005", "2010", "2007"],
		answer: "2009",
		images: ["https://media2.giphy.com/media/26tknCqiJrBQG6bxC/giphy.gif", "http://www.reactiongifs.com/r/wrong-gif.gif"]
	},
	{
		question: "Which movie is considered the 'greatest christmas film' of all time'?",
		choices: ["Home Alone", "The Santa Clause", "Scrooged", "Die Hard"],
		answer: "Die Hard",
		images: ["https://media2.giphy.com/media/26tknCqiJrBQG6bxC/giphy.gif", "http://www.reactiongifs.com/r/wrong-gif.gif"]
	}
];

let domElements = {
	addButtonList: function(){
		let ul = $("<ul>");

		$("#answerSection").append(ul);

		$.each(questionsList[0].choices, function(){
			ul.append($("<li><button>"));
		});
	},
	addStartGameElements: function(buttonText){
		let startGameButton = $("<button>").attr("id", "startGameButton").text(buttonText);
		let span0 = $("<span>").css({"color":"#7176D4"}).text("Welcome ");
		let span1 = $("<span>").css({"color":"#EA276D"}).text(" AB");
		let span2 = $("<span>").css({"color":"#FFD255"}).text(" Trivia!");

		let title = $("<h1>").attr("class","center").attr("id", "title").append([span0, "to", span1, span2]);

		startGameButton.on("click", function(){

			$("#title").hide();

			$("#outerContainer").css({"top": "10%"})

			$("#innerContainer").show();

			game.initGame();

			$(this).remove();

		});

		return [title,startGameButton];
	},
	addBackgroundCircles: function(){
		let backgroundDiv = $("<div>").attr("id", "backgroundCircles");
		let circles = ["red", "yellow", "blue", "purple", "teal"];

		$.each(circles, function(index, color){
			console.log(color);
			let circleDiv = $("<div>").attr("id", color+"Circle").attr("class", "circle");
			backgroundDiv.append(circleDiv);
		});

		return backgroundDiv;
	}
}

let game = {
	totalRounds: questionsList.length-1,
	roundTime: 0,
	roundNumber: 0,
	correctAnswers: 0,
	incorrectAnswers: 0,
	unansweredQuestions: 0,
	isAnswerCorrect: false,
	secondsTimer: null,
	roundLoop: null,
	betweenRoundLoop: null,
	initRoundTimer: function(time){
		return game.roundTime;
	},
	initGame: function(){
		game.roundNumber = 0;
		game.correctAnswers = 0;
		game.incorrectAnswers = 0;
		game.unansweredQuestions = 0;

		let timerSpan = $("<span>").attr("id", "timer");
		let questionLabel = $("<h2>").attr("id", "question");

		$("#timerSection").empty().append($("<h1>").append(timerSpan));
		$("#questionSection").append(questionLabel);
		$("#gameStats").remove();

		game.initRound();
	},
	initRound: function(){
		clearTimeout(game.betweenRoundLoop);

		game.roundTime = 10;

		game.isAnswerCorrect = false;

		game.roundNumber++;

		game.displayQuestion();

		game.startRoundTimer();

		game.roundLoop = setTimeout(function(){
			game.initRound();
		}, 11000);

	},
	startRoundTimer: function(){
		let formattedSeconds = this.roundTime;

		if(this.roundTime % 10 != 0 || this.roundTime == 0) formattedSeconds = "0"+this.roundTime;

		$("#timer").text(formattedSeconds);

		this.roundTime--;

		game.secondsTimer = setTimeout(function(){

			game.startRoundTimer();

		}, 1000);

		if(this.roundTime < 0){

			game.unansweredQuestions++;

			if(game.roundNumber-1 != game.totalRounds) game.betweenRoundLoop = setTimeout(game.initRound, 3000);

			game.displayEndRound();
		}
	},
	displayQuestion: function(){
		$("#endRound").remove();

		domElements.addButtonList();

		$("#question, #answerSection ul li button").empty();

		$("#question").text(questionsList[game.roundNumber-1].question);

		$.each($("#answerSection ul li button"), function(index, element){

			let button = $(this);

			button.text(questionsList[game.roundNumber-1].choices[index]);

			button.on("click", function(){
				game.checkAnswer(button);
			});

		})
	},
	checkAnswer: function(button){
		let choice = button.text();
		let answer = questionsList[game.roundNumber-1].answer;

		if(choice == answer){
			game.isAnswerCorrect = true;
			game.correctAnswers++;
		}else{
			game.isAnswerCorrect = false;
			game.incorrectAnswers++;
		}

		if(game.roundNumber-1 != game.totalRounds) game.betweenRoundLoop = setTimeout(game.initRound, 3000);

		game.displayEndRound();
	},
	displayGameMessage: function(){
		let message;

		if(game.roundTime < 0){
			message = "You ran out of time slow poke!";
		}else{
			message = game.isAnswerCorrect ? "You are correct!" : "You are wrong!";
		}

		$("#question").empty().text(message);
	},
	displayEndRound: function(){
		let image = $("<img>");
		let endRoundDiv = $("<div>").attr("id", "endRound");
		let imageSrc = game.isAnswerCorrect ? questionsList[game.roundNumber-1].images[0] : questionsList[game.roundNumber-1].images[1]

		image.attr("src", imageSrc).attr("class", "img-fluid");

		clearTimeout(game.secondsTimer);
		clearTimeout(game.roundLoop);

		$("#answerSection").empty().append(endRoundDiv);
		$("#endRound").append(image);

		game.displayGameMessage();

		if(game.roundNumber-1 == game.totalRounds) setTimeout(game.displayEndGame, 3000);
	},
	displayEndGame: function(){
		let correctAnswersText = $("<h3>").text("Correct Answers: " + game.correctAnswers);
		let incorrectAnswersText = $("<h3>").text("Incorrect Answers: " + game.incorrectAnswers);
		let unansweredQuestionsText = $("<h3>").text("Unanswered Questions: " + game.unansweredQuestions);
		let startGameButton = domElements.addStartGameElements("Play Again!")[1].css({"color": "black"});

		let gameStats = $("<div>").attr("id", "gameStats").append([correctAnswersText, incorrectAnswersText, unansweredQuestionsText, startGameButton]);

		$("#questionSection, #timerSection").empty();
		$("#timerSection").append($("<h1>").text("Good Job"));
		$("#contentSection").prepend(gameStats);

		startGameButton.show();
	}
}

$(document).ready(function(){

	//$(".container").prepend(domElements.addBackgroundCircles());

	$("#outerContainer").css({"top": "40%"}).prepend(domElements.addStartGameElements("Start Game"));

	$("#innerContainer").hide();

});