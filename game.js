const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById('loader');
const game = document.getElementById('game');
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
.then((res) => {
  return res.json();
})
.then((loadedQuestions) => {
  questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
          question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
          formattedQuestion.answer - 1,
          0,
          loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
          formattedQuestion['choice' + (index + 1)] = choice;
      });

      return formattedQuestion;
  });



  startGame();
})
.catch((err) => {
  console.error(err);
});

// let questions = [
//   {
//     question: "Inside which HTML element do we put the JavaScript??",
//     choice1: "<script>",
//     choice2: "<javascript>",
//     choice3: "<js>",
//     choice4: "<scripting>",
//     answer: 1
//   },
//   {
//     question:
//       "What is the correct syntax for referring to an external script called 'file.js'?",
//     choice1: "<script href='file.js'>",
//     choice2: "<script name='file.js'>",
//     choice3: "<script src='file.js'>",
//     choice4: "<script file='file.js'>",
//     answer: 3
//   },
//   {
//     question: " How do you write 'Hello World' in an alert box?",
//     choice1: "msgBox('Hello World');",
//     choice2: "alertBox('Hello World');",
//     choice3: "msg('Hello World');",
//     choice4: "alert('Hello World');",
//     answer: 4
//   }
// ];

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  getNewQuestion();
//   game.classList.remove('hidden');
//   loader.classList.add('hidden');
};

getNewQuestion = () => {
  if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuesions.length);
  currentQuestion = availableQuesions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuesions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

startGame();