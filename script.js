// Получаем элементы DOM (предполагается, что они уже есть в вашем коде)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const windSlider = document.getElementById('windSlider');
const threadsSlider = document.getElementById('threadsSlider');
const threadsValue = document.getElementById('threadsValue');

let windStrength = parseInt(windSlider.value);
let numThreads = parseInt(threadsSlider.value);
let threads = [];

// Класс Thread для одной нити
class Thread {
    constructor(x, yTop, yBottom, scatter) {
        this.x = x; // Начальная позиция X
        this.yTop = yTop; // Верхняя точка
        this.yBottom = yBottom; // Нижняя точка
        this.points = []; // Точки вдоль нити
        this.numPoints = 20; // Количество точек на нить
        this.scatter = scatter; // Сила разброса
        this.speed = (Math.random() - 0.5) * 2; // Случайная скорость от -1 до 1
        this.initPoints();
    }

    // Инициализация точек нити
    initPoints() {
        this.points = [];
        for (let i = 1; i < this.numPoints - 1; i++) {
            const y = this.yTop + (i / (this.numPoints - 1)) * (this.yBottom - this.yTop);
            const offset = (Math.random() - 0.5) * this.scatter;
            this.points.push({ x: this.x + offset, y });
        }
    }

    // Обновление позиций точек с учетом ветра и случайности
    update(time) {
        for (let i = 0; i < this.points.length; i++) {
            const baseX = this.x + (this.points[i].x - this.x) * (i / (this.numPoints - 1));
            const wave = Math.sin(time * 0.001 + i * 0.5 + this.speed) * windStrength * 0.1;
            this.points[i].x = baseX + wave + this.speed;
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

// Создание нитей
function createThreads() {
    threads = [];
    const scatterStrength = 20; // Можно привязать к ползунку, если он есть
    for (let i = 0; i < numThreads; i++) {
        const x = (i / (numThreads - 1)) * canvas.width;
        threads.push(new Thread(x, 0, canvas.height, scatterStrength));
    }
}

// Настройка ползунка для количества нитей
threadsSlider.min = 10;
threadsSlider.max = 250;
threadsSlider.value = 100; // Начальное значение
numThreads = parseInt(threadsSlider.value);
threadsValue.textContent = numThreads;

// Обработка изменения ползунка
threadsSlider.addEventListener('input', () => {
    numThreads = parseInt(threadsSlider.value);
    threadsValue.textContent = numThreads;
    createThreads();
});

// Обработка изменения силы ветра
windSlider.addEventListener('input', () => {
    windStrength = parseInt(windSlider.value);
});

// Анимация
function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка канваса
    threads.forEach(thread => {
        thread.update(time);
        thread.draw();
    });
    requestAnimationFrame(animate);
}

// Инициализация
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
createThreads();
requestAnimationFrame(animate);
