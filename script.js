const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const windSlider = document.getElementById('wind');
const scatterSlider = document.getElementById('scatter');
const threadsSlider = document.getElementById('threads');
const windValue = document.getElementById('windValue');
const scatterValue = document.getElementById('scatterValue');
const threadsValue = document.getElementById('threadsValue');

// Начальные значения параметров
let windStrength = parseInt(windSlider.value);
let scatterStrength = parseInt(scatterSlider.value);
let numThreads = parseInt(threadsSlider.value);

// Обработчики событий для ползунков
windSlider.addEventListener('input', () => {
    windStrength = parseInt(windSlider.value);
    windValue.textContent = windStrength;
});

scatterSlider.addEventListener('input', () => {
    scatterStrength = parseInt(scatterSlider.value);
    scatterValue.textContent = scatterStrength;
});

threadsSlider.addEventListener('input', () => {
    numThreads = parseInt(threadsSlider.value);
    threadsValue.textContent = numThreads;
    createThreads();
});

// Установка размеров canvas и обработка изменения окна
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createThreads();
});

// Класс для нити
class Thread {
    constructor(x, yTop, yBottom, scatter) {
        this.x = x; // Базовая горизонтальная позиция
        this.yTop = yTop; // Верхняя точка
        this.yBottom = yBottom; // Нижняя точка
        this.points = []; // Промежуточные точки
        this.numPoints = 20; // Количество точек на нить
        this.scatter = scatter; // Начальный разброс
        this.initPoints();
    }

    // Инициализация промежуточных точек
    initPoints() {
        this.points = [];
        for (let i = 1; i < this.numPoints - 1; i++) {
            const y = this.yTop + (i / (this.numPoints - 1)) * (this.yBottom - this.yTop);
            const offset = (Math.random() - 0.5) * this.scatter;
            this.points.push({ x: this.x + offset, y });
        }
    }

    // Обновление позиций точек под воздействием ветра
    update(time) {
        for (let i = 1; i < this.numPoints - 1; i++) {
            const baseX = this.x + (this.points[i - 1].x - this.x) * (i / (this.numPoints - 1));
            const wave = Math.sin(time + i * 0.5) * windStrength * 0.1;
            this.points[i - 1].x = baseX + wave;
        }
    }

    // Отрисовка нити
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.yTop);
        this.points.forEach(point => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(this.x, this.yBottom);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Массив нитей
let threads = [];

// Создание нитей
function createThreads() {
    threads = [];
    const spacing = canvas.width / (numThreads + 1);
    for (let i = 1; i <= numThreads; i++) {
        const x = i * spacing;
        const scatter = scatterStrength * 10; // Усиление разброса
        threads.push(new Thread(x, 0, canvas.height, scatter));
    }
}

// Инициализация нитей
createThreads();

// Анимация
let time = 0;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
    threads.forEach(thread => {
        thread.update(time);
        thread.draw();
    });
    time += 0.05; // Шаг времени для плавности
    requestAnimationFrame(animate);
}

animate();
