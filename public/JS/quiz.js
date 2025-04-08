function nextQuestion(nextId) {
    document.querySelectorAll('.quiz-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(nextId).style.display = 'block';
}

function submitAnswer(answerName, correctValue, resultId) {
    const selectedOption = document.querySelector(`input[name="${answerName}"]:checked`);
    const result = document.getElementById(resultId);

    if (selectedOption) {
        if (selectedOption.value === correctValue) {
            result.textContent = "Correct! Well done!";
            result.style.color = "green";
        } else {
            result.textContent = "Incorrect. Try again!";
            result.style.color = "red";
        }
    } else {
        result.textContent = "Please select an option.";
        result.style.color = "white";
    }
}

function finishQuiz() {
    alert("Quiz completed! Thank you for participating.");
}