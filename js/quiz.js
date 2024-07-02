const cultureSelect = document.getElementById('culture-select');
let currentCulture = cultureSelect.value;

async function loadJSON(file) {
    const response = await fetch(file);
    return await response.json();
}

async function loadQuizData() {
    return await loadJSON('data/quizData.json');
}

function clearQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
}

function saveProgress(culture, progress) {
    localStorage.setItem(`quizProgress-${culture}`, JSON.stringify(progress));
}

function loadProgress(culture) {
    const progress = localStorage.getItem(`quizProgress-${culture}`);
    return progress ? JSON.parse(progress) : {};
}

async function initializeQuiz() {
    const quizData = await loadQuizData();
    const quizContainer = document.getElementById('quiz-container');
    const progress = loadProgress(currentCulture);

    quizData.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const themeElement = document.createElement('div');
        themeElement.classList.add('theme');
        themeElement.innerText = q.theme;
        questionElement.appendChild(themeElement);

        const questionTitle = document.createElement('h2');
        questionTitle.innerHTML = q.question;
        questionElement.appendChild(questionTitle);

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        Object.keys(q.options).forEach(key => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.setAttribute('data-answer', key);
            optionElement.innerHTML = `${key}. ${q.options[key]}`;

            if (progress[index] && progress[index].selectedAnswer === key) {
                optionElement.classList.add('active');
                if (key === q.correctAnswer) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                }
            }

            optionElement.addEventListener('click', () => {
                document.querySelectorAll('.option').forEach(opt => opt.classList.remove('active', 'correct', 'incorrect'));
                optionElement.classList.add('active');

                if (key === q.correctAnswer) {
                    optionElement.classList.add('correct');
                } else {
                    optionElement.classList.add('incorrect');
                }

                const feedback = document.getElementById(`feedback-${index}`);
                feedback.innerHTML = `<p>${q.responses.US[key]}</p>`;
                feedback.style.display = 'block';

                progress[index] = { selectedAnswer: key };
                saveProgress(currentCulture, progress);
            });

            optionsContainer.appendChild(optionElement);
        });

        const feedback = document.createElement('div');
        feedback.classList.add('feedback');
        feedback.id = `feedback-${index}`;

        if (progress[index]) {
            feedback.innerHTML = `<p>${q.responses.US[progress[index].selectedAnswer]}</p>`;
            feedback.style.display = 'block';
        }

        questionElement.appendChild(optionsContainer);
        questionElement.appendChild(feedback);

        quizContainer.appendChild(questionElement);
    });
}

// Initialize quiz with default culture
initializeQuiz();
