/**
 * IMPORTS
 */


 /**
  * stateCapitals contains all the data regarding the state capitals
  */
import { stateCapitals } from "./data.js";



/**
 * MODEL ENTITIES
 */


/**
 * userState stores all the data for the user's questions and answers progress
 */ 
let userState = {
    currentQuestion: 0,
    totalQuestions: 10, 
    correctAnswers: 0,
    wrongAnswers: 0
};

/**
 * Question stores the question information needed to generate a question (capital id, state and state capital)
 */
class Question {
    constructor(id, state, capital) {
        this.id = id;
        this.state = state;
        this.capital = capital;
        this.text = `What is the capital of the State of ${state}?`;
        this.otherAnswers = [];
    };
};

let question = null;



/**
 * EVENT HANDLERS
 */


 /**
  * Event handler for btnStart, btnNext and btnRestart click() event
  */
function startQuiz() {
    $('#btnStart, #btnNext, #btnRestart').on('click', function (event) {
        
        const btn = $(event.currentTarget);
        const btnType = btn.attr('id');
        console.log(`btnType: ${btnType}`);

        //Manage action for the button:
        if (btnType == "btnRestart") { //for reStart set the userState props
            //console.log('in ReStart');
            userState.currentQuestion = 0;
            userState.correctAnswers = 0;
            userState.wrongAnswers = 0;

            //re-start the quizz
            nextQuestion(btnType);
        }
        else if (userState.currentQuestion == userState.totalQuestions) { //end quiz and go to summary
            //console.log('in Summary');
            loadSummary();
            //prevent form reload
            event.preventDefault();
        }
        else { //load a new question
            //console.log('in NextQuestion');
            nextQuestion(btnType);
        }
    });
};
$(startQuiz);


/**
 * Event handler for answerForm.submit() 
 */
function checkAnswer() {
    $('#answerForm').on('submit', function (event) {

        //prevent submit
        event.preventDefault();

        //check answer workflow
        checkAnswerWorkflow();       
    });
}
$(checkAnswer);


/**
 * WORKFLOWS
 */


/**
 * Function in charge of the question workflow
 */
function nextQuestion(actionType) {
    //create new question
    question = generateQuestion();

    //render question in window
    generateHTMLQuestion(question);

    //update the question #
    userState.currentQuestion++;
    //console.log(`we're in question: ${userState.currentQuestion}`);

    //render userState in window
    manageUserStateHTML(userState);

    //manage window visibility
    if (actionType == "btnStart") {
        manageWindow('section#landing');
        manageWindow('section#question');
    }
    else if (actionType == "btnNext") {
        manageWindow('section#question');
        manageWindow('section#answer-evaluator');
    }
    else if (actionType == "btnRestart") {
        manageWindow('section#summary');
        manageWindow('section#question');
    }

}


/**
 * Function in charge of the check-answer workflow
 */
function checkAnswerWorkflow() {
    //get the selected checkbox
    const checkedValue = getSelectedAnswer();

    //Validate if the option is correct and update userState object
    const right = validateAnswer(checkedValue);

    //render HTML with response
    generateHTMLAnswer(question, right);

    //render userState in window
    manageUserStateHTML(userState);

    //console.log('in checkAnswer()');
    
    //manage window visibility
    manageWindow('section#question');
    manageWindow('section#answer-evaluator');
};


/**
 * Function in charge of the summary workflow
 */
function loadSummary() {
console.log('in loadSummary()');
    //create and render summary
    generateHTMLSummary();

    //manage window visibility
    manageWindow('section#answer-evaluator');
    manageWindow('section#summary');
}



/**
 * HTML MANAGERS
 */


/**
 * Function in charge of creating and rendering the question html
 */
function generateHTMLQuestion(question) {

    //Add question
    let currentQuestion = $('section#question').find('.main');
    currentQuestion.html(`<h1 class="question">${question.text}</h1>`);

    //Add options
    let currentOptions = $('section#question').find('.options');
    let options = ``;
    question.otherAnswers.forEach(element =>
        options += `<div class="option">
                        <input type="radio" name="answer" value="${element.id}" required> ${element.capital}
                    </div>`
    );

    //render Question and Answers
    currentOptions.html(options);
};

/**
 * Function in charge of creating and rendering the answer-check html
 */
function generateHTMLAnswer(question, answerRight) {

    //Add question
    let currentQuestion = $('section#answer-evaluator').find('.main');
    currentQuestion.html(`<h1 class="question">Your answer for the capital of ${question.state} is:</h1>`);

    //Add response
    let answer = $('section#answer-evaluator').find('.answer');

    let answerHTML = '';

    if (answerRight) {
        answerHTML += `<p>Your answer is RIGHT!, the capital of the State of ${question.state} is ${question.capital}!</p>`;
    }
    else {
        answerHTML += `<p>Small mistake, the correct answer for the state of ${question.state} is ${question.capital}.</p>`;
    }

    //Render Question and Answer Message
    answer.html(answerHTML);

    //Change button text to go to summary when question counter gets to the set max
    let btn = $('section#answer-evaluator').find('button#btnNext');
    changeButtonText(userState.currentQuestion == userState.totalQuestions);
};


/**
 * Function in charge of creating and rendering the summary html
 */
function generateHTMLSummary() {
//console.log('in generateHTMLSummary()');
    //Add question
    let currentQuestion = $('section#summary').find('.main');
    currentQuestion.html(`<h1 class="question">So, how did you do in the quizz?</h1>`);

    //Add Summary
    let summaryHTML = `<p class="answer">Your final score is <b> ${userState.correctAnswers} answers right </b> out of ${userState.totalQuestions} questions!</p>`;

    //Render Summary
    let summary = $('section#summary').find('.answer');
    summary.html(summaryHTML);
}


/**
 * Function in charge of getting the nselected answer value from the the question view
 */
function getSelectedAnswer(){
    //get the selected checkbox
    let option = $('section#question').find('.option');
    let radioSelected = option.find('input[name="answer"]:checked');
    let checkedValue = radioSelected.attr('value');
    return checkedValue;
};


/**
 * Function in charge of checking if the selected answer is correct/wrong, and
 * also of updating the userState correct and wrong counters accordingly.
 * 
 * @param {number} value 
 */
function validateAnswer(value) {
    if (question.id == value) {
        userState.correctAnswers++;
        return true;
    }
    userState.wrongAnswers++;
    return false;
};


/**
 * Function in charge of loading the user's answer progress in the top page counters
 * 
 * @param {object} userState 
 */
function manageUserStateHTML(userState) {

    let questionCounter = `<b>Question:</b> ${userState.currentQuestion}/10`;
    let scoreCounter = `<b>Score:</b> Right: ${userState.correctAnswers} / Wrong: ${userState.wrongAnswers}`;
    $('.question-counter').html(questionCounter);
    $('.score-counter').html(scoreCounter);
};


/**
 * Function in charge of managing the visibility of each section for rendering in the page
 * 
 * @param {HTML section} window 
 */
function manageWindow(window) {
    //console.log(`manageWindow(${window})`)
    $(window).toggleClass('hidden');
};


/**
 * Function in charge of changing the text in btnNext for Summary view
 */
function changeButtonText(isSummary) {
    let btn = $('section#answer-evaluator').find('button#btnNext');
    let summaryText = 'Go To Summary';
    let nextQuestionText = 'Next Question';
    if (isSummary) {
        btn.html(summaryText);
    }
    else {
        btn.html(nextQuestionText);
    }
};



/**
 * QUESTION AND INDEX GENERATORS
 */


 /**
  * Function in charge of generating a question
  */
function generateQuestion() {
    const index = generateIndex();
    let stateData = stateCapitals[index];
    let question = new Question(stateData.id, stateData.state, stateData.capital);
    //console.log(`index question: ${index} - stateId: ${stateData.id}`);
    question.otherAnswers = generateOptions(stateData.id);
    return question;
};


/**
 * Function in charge of generating the answer options:
 * a. generates three extra answers
 * b. adds the correct answer to the array of answers
 * 
 * @param {number} stateId 
 */
function generateOptions(stateId) {
    let options = [];
    for (let i = 0; i < 3; i++) {
        let index = generateIndex();
        //validate that we don't repeat the correct answer
        const stateIndex = stateId - 1;
        if (index == stateIndex) {
            index = generateIndex();
        }
        //add new state capital to options
        //console.log(`index option${i}: ${index}`);
        options.push({
            id: index + 1,
            capital: stateCapitals[index].capital,
        });
    };

    //add the correct answer in options
    let position = Math.floor(Math.random() * 4);
    //console.log(`index: ${stateId - 1} - stateId: ${stateId}`);  
    options.splice(position, 0, {
        id: stateId,
        capital: stateCapitals[stateId - 1].capital
    });

    return options;
}


/**
 * Helper function to generate random numbers, from 0 to 49, both inclusive
 */
//generates a number from 0 to 49, both inclusive
function generateIndex() {
    const min = Math.ceil(0);
    const max = Math.floor(49);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};




