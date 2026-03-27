let currentTask = 0;
let userNick = '';
let results = {};
// Счётчики для текущей сессии
let sessionCorrect = 0;
let sessionWrong = 0;
let quizCompleted = false; // Флаг завершения теста
// Храним номера решенных задач для каждого пользователя
let userSolvedTasks = {}; 

const tasks = [
    {
        text: "Масса тела — 5 кг. Каков его вес на Земле? (g = 9,8 Н/кг)",
        answer: "49"
    },
    {
        text: "Какова плотность воды, если масса — 2 кг, объём — 2 л? (ответ в кг/л)",
        answer: "1"
    },
    {
        text: "Сила тяги автомобиля — 3000 Н, сила сопротивления — 2500 Н. Чему равна равнодействующая сила?",
        answer: "500"
    },
    {
        text: "Поезд проехал 1,2 км за 2 минуты. Найдите его скорость в м/с.",
        answer: "10"
    },
    {
        text: "Какую массу имеет стеклянная пластина объёмом 4 дм³? (Плотность стекла ≈ 2500 кг/м³). Ответ в кг.",
        answer: "10"
    },
    {
        text: "Мраморная колонна массой 500 т имеет площадь основания 12,5 м². Определите давление колонны на опору в кПа. (g=10)",
        answer: "400"
    },
];


function updateTask() {
    const task = tasks[currentTask];
    document.getElementById('taskText').textContent = task.text;
    document.getElementById('taskNumber').textContent = currentTask + 1;
    document.getElementById('userAnswer').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('result').className = 'result-message';
    
    // Разблокируем кнопку и фокус при новой задаче
    const checkBtn = document.querySelector('.btn-check');
    if(checkBtn) checkBtn.disabled = false;
    
    document.getElementById('userAnswer').focus();
}

function checkAnswer() {
    const task = tasks[currentTask];
    const answer = task.answer.trim();
    const userInput = document.getElementById('userAnswer').value.trim();
    const resultEl = document.getElementById('result');
    const checkBtn = document.querySelector('.btn-check');

    if (!userInput) {
        resultEl.textContent = "⚠️ Введите ответ!";
        resultEl.className = "result-message wrong";
        return;
    }

    if (userInput === answer) {
        resultEl.textContent = "✅ Правильно! Молодец!";
        resultEl.className = "result-message correct";
        
        // Блокируем кнопку, чтобы нельзя было нажать повторно
        if(checkBtn) checkBtn.disabled = true;

        if (userNick) {
            // Инициализируем список решенных для пользователя, если его нет
            if (!userSolvedTasks[userNick]) {
                userSolvedTasks[userNick] = new Set();
            }

            // Проверяем, не решал ли пользователь уже эту задачу
            if (!userSolvedTasks[userNick].has(currentTask)) {
                userSolvedTasks[userNick].add(currentTask); // Помечаем как решенную
                results[userNick] = (results[userNick] || 0) + 1; // Начисляем балл
                updateTable();
            }
        }
    } else {
        resultEl.textContent = `❌ Ошибка. Правильный ответ: ${answer}`;
        resultEl.className = "result-message wrong";
    }
}

function resetTask() {
    const card = document.querySelector('.task-card');
    if(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
    }
    
    setTimeout(() => {
        currentTask = (currentTask + 1) % tasks.length;
        updateTask();
        if(card) {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    }, 200);
}

function updateTable() {
    const tbody = document.querySelector("#resultsTable tbody");
    if(!tbody) return;
    
    tbody.innerHTML = '';
    
    const sortedResults = Object.entries(results).sort((a, b) => b[1] - a[1]);

    if (sortedResults.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#999;">Пока нет результатов</td></tr>';
        return;
    }

    for (const [nick, count] of sortedResults) {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${nick}</strong></td><td>${count}</td>`;
        tbody.appendChild(row);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nickInput = document.getElementById('nick');
    
    nickInput.addEventListener('change', function() {
        userNick = this.value.trim();
    });

    document.getElementById('userAnswer').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            // Если кнопка не заблокирована, проверяем
            const checkBtn = document.querySelector('.btn-check');
            if(!checkBtn || !checkBtn.disabled) {
                checkAnswer();
            }
        }
    });

    updateTask();
    updateTable();
});
