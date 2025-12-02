import * as THREE from 'three';

// --- THREE.JS SETUP (FONDO Y MICROFONO) ---

const scene = new THREE.Scene();
const fog = new THREE.FogExp2(0x1a0b2e, 0.002);
scene.fog = fog;

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 15); 

// -- CONSTRUCCIÓN DEL MICRÓFONO --
const micGroup = new THREE.Group();

// Mango 
const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 9, 32),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.9 })
);
handle.position.y = -4.5;

// Cabeza externa
const head = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 40, 40),
    new THREE.MeshStandardMaterial({ color: 0x9370db, wireframe: true, metalness: 0.1, transparent: true, opacity: 0.7 })
);
head.position.y = 1.5;

// Cabeza interna (Luz)
const innerHeadMat = new THREE.MeshStandardMaterial({ 
    color: 0x4b0082, 
    emissive: 0x2a004a,
    emissiveIntensity: 1.5 
});
const innerHead = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), innerHeadMat);
innerHead.position.y = 1.5;

micGroup.add(handle, head, innerHead);
scene.add(micGroup);

// -- LUCES --
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
const dynamicLight = new THREE.PointLight(0xbc13fe, 5, 50); 
dynamicLight.position.set(0, 5, 5);

scene.add(ambientLight, pointLight, dynamicLight);

// -- ESTRELLAS --
function addStar() {
  const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(300).fill().forEach(addStar);

// -- INTERACCIÓN MOUSE --
let mouseX = 0;
let mouseY = 0;
let spinSpeed = 0.003; 

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// -- ANIMACIÓN --
function animate() {
  requestAnimationFrame(animate);
  micGroup.rotation.y += (mouseX * 0.5 - micGroup.rotation.y) * 0.05 + spinSpeed;
  micGroup.rotation.x += (mouseY * 0.5 - micGroup.rotation.x) * 0.05;

  const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.03;
  innerHead.scale.setScalar(pulse);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// --- LÓGICA DE LA TRIVIA ---

const questions = [
    { 
        question: "¿Cuál es el álbum que catapultó a Humbe y contiene 'El Poeta'?", 
        options: ["Sonámbulo", "Entropía", "Aurora", "Esencia"], 
        correct: 1, 
        searchQuery: "Humbe Te lo prometo",
        info: "'Entropía' (2021) marcó su firma con Sony Music y definió su estilo. Él mismo lo produjo junto a su hermano."
    },
    { 
        question: "¿De qué ciudad es originario Humbe?", 
        options: ["CDMX", "Guadalajara", "Monterrey", "Puebla"], 
        correct: 2, 
        searchQuery: "Humbe Amor de Cine", 
        info: "¡Puro Norte! Humbe nació y creció en Monterrey, Nuevo León, una ciudad clave para su inspiración visual."
    },
    { 
        question: "¿Cómo se llama la canción viral que dice 'Te conocí en Japón'?", 
        options: ["Tokio", "Japón", "Te conocí en Japón", "Viajero"], 
        correct: 2, 
        searchQuery: "Humbe Te conocí en Japón",
        info: "Aunque muchos la buscan como 'Japón', el título oficial es la frase completa. ¡Fue un fenómeno en TikTok!"
    },
    { 
        question: "¿En qué año fue nominado al Latin Grammy como Mejor Nuevo Artista?", 
        options: ["2020", "2021", "2022", "2023"], 
        correct: 1, 
        searchQuery: "Humbe sanvalentin:(",
        info: "En 2021, la Academia reconoció su rápido ascenso tras el éxito masivo de 'Entropía'."
    },
    { 
        question: "¿Qué canción de humbe habla profundamente sobre el duelo y la pérdida?", 
        options: ["fantasmas", "mamá", "tú me hiciste volar", "himno"], 
        correct: 0, 
        searchQuery: "Humbe fantasmas",
        info: "'Fantasmas' es una pieza emotiva sobre la ausencia y los recuerdos que quedan en lugares cotidianos."
    },
    { 
        question: "¿Cuál es el apellido de Humbe?", 
        options: ["Garza", "Rodríguez", "Sánchez", "Fernández"], 
        correct: 1, 
        searchQuery: "Humbe TSQ",
        info: "Su nombre completo es Humberto Rodríguez Terrazas. 'Humbe' es simplemente su apodo de toda la vida."
    },
    { 
        question: "¿Con qué banda colaboró en la canción 'MALBEC'?", 
        options: ["Matisse", "Reik", "Camila", "Sin Bandera"], 
        correct: 1, 
        searchQuery: "Humbe Reik MALBEC",
        info: "Colaborar con Reik fue un sueño cumplido, uniendo el pop clásico mexicano con su nueva propuesta."
    },
    { 
        question: "¿Quién es su hermano y productor habitual?", 
        options: ["Emiliano", "Alejandro", "Roberto", "Diego"], 
        correct: 0, 
        searchQuery: "Humbe Confieso",
        info: "Emiliano Rodríguez no solo es su hermano, es su 'partners in crime' en la producción de casi todos sus temas."
    },
    { 
        question: "¿Qué álbum lanzó en 2023?", 
        options: ["Aurora", "Entropía", "Esencia", "Adultos"], 
        correct: 2, 
        searchQuery: "Humbe ESENCIA",
        info: "'Esencia' es considerado su trabajo más introspectivo y maduro hasta la fecha, explorando sus raíces."
    },
    { 
        question: "¿Qué instrumento comenzó a tocar a los 9 años?", 
        options: ["Guitarra", "Batería", "Piano", "Violín"], 
        correct: 2, 
        searchQuery: "Humbe REM",
        info: "El piano es la base de su composición. Comenzó de niño y es el corazón de sus baladas."
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; 
const audioPlayer = document.getElementById('game-audio');

// Elementos DOM
const startScreen = document.getElementById('start-screen');
const quizContainer = document.getElementById('quiz-container');
const infoPanel = document.getElementById('info-panel');
const infoText = document.getElementById('info-text');
const infoContentBox = document.getElementById('info-content-box'); // Contenedor del texto info
const startButton = document.getElementById('start-btn');

const questionEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback-msg');
const progressEl = document.getElementById('current-q');
const gameUi = document.getElementById('game-ui'); // Contenedor principal del juego
const resultsUi = document.getElementById('results-ui');

// Elementos de Resultados
const finalScoreEl = document.getElementById('final-score');
const finalRankEl = document.getElementById('final-rank');
const finalMsgEl = document.getElementById('final-message');
const resultsListEl = document.getElementById('results-list');


// --- ILUMINACIÓN ---
function setAtmosphere(state) {
    const defaultColor = new THREE.Color(0xbc13fe); 
    const correctColor = new THREE.Color(0x00ff88); 
    const wrongColor = new THREE.Color(0xff3333); 

    if (state === 'correct') {
        dynamicLight.color.set(correctColor);
        innerHeadMat.emissive.set(correctColor);
        spinSpeed = 0.03; 
    } else if (state === 'wrong') {
        dynamicLight.color.set(wrongColor);
        innerHeadMat.emissive.set(wrongColor);
        spinSpeed = 0.003; 
    } else {
        dynamicLight.color.lerp(defaultColor, 0.1);
        innerHeadMat.emissive.set(new THREE.Color(0x2a004a));
        spinSpeed = 0.003;
    }
}

// --- LOGICA DE AUDIO ---
async function fetchAndPlayMusic(query) {
    if(!query) return;
    try {
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`https://itunes.apple.com/search?term=${encodedQuery}&media=music&limit=1`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const track = data.results[0];
            audioPlayer.src = track.previewUrl;
            audioPlayer.volume = 0.5;
            audioPlayer.play().catch(e => console.log("Error play:", e));
        }
    } catch (error) {
        console.error("Error iTunes API:", error);
    }
}

function stopAudio() {
    let vol = audioPlayer.volume;
    const fade = setInterval(() => {
        if (vol > 0.05) {
            vol -= 0.1;
            audioPlayer.volume = vol;
        } else {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            clearInterval(fade);
        }
    }, 100);
}

// --- JUEGO Y TRANSICIONES ---

startButton.addEventListener('click', startGame);

function startGame() {
    startScreen.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    infoPanel.classList.remove('hidden'); 
    loadQuestion();
}

function loadQuestion() {
    // 1. Limpieza de clases de salida anterior (si las hubiera)
    gameUi.classList.remove('content-exit');
    infoContentBox.classList.remove('content-exit');

    // 2. Cargar datos
    setAtmosphere('default'); 
    const currentQ = questions[currentQuestionIndex];
    
    progressEl.innerText = currentQuestionIndex + 1;
    questionEl.innerText = currentQ.question;
    optionsEl.innerHTML = ''; 
    feedbackEl.innerText = '';
    feedbackEl.classList.add('hidden');

    infoText.innerText = "Selecciona una opción para descubrir el dato curioso...";
    infoText.style.opacity = "0.7";

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.classList.add('option-btn');
        btn.onclick = () => checkAnswer(index);
        optionsEl.appendChild(btn);
    });

    // 3. Aplicar Animación de Entrada
    gameUi.classList.add('content-enter');
    infoContentBox.classList.add('content-enter');

    // 4. Limpiar la clase de entrada después de la animación para no afectar futuros estados
    setTimeout(() => {
        gameUi.classList.remove('content-enter');
        infoContentBox.classList.remove('content-enter');
    }, 600);
}

function checkAnswer(selectedIndex) {
    const currentQ = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedIndex === currentQ.correct;

    userAnswers.push({
        question: currentQ.question,
        isCorrect: isCorrect,
        correctAnswer: currentQ.options[currentQ.correct]
    });

    // Actualizar Info Panel (con efecto visual simple de opacidad)
    infoText.style.opacity = "0";
    setTimeout(() => {
        infoText.innerHTML = `<strong style="color:#b66dff">Info:</strong> ${currentQ.info}`;
        infoText.style.opacity = "1";
    }, 200);
    

    if (isCorrect) {
        score++;
        buttons[selectedIndex].classList.add('correct');
        feedbackEl.innerText = "¡CORRECTO! Escucha esto...";
        feedbackEl.style.color = "#00ff88";
        setAtmosphere('correct');
    } else {
        buttons[selectedIndex].classList.add('wrong');
        buttons[currentQ.correct].classList.add('correct');
        feedbackEl.innerText = `Ups... era: ${currentQ.options[currentQ.correct]}`;
        feedbackEl.style.color = "#ff3333";
        setAtmosphere('wrong');
    }

    feedbackEl.classList.remove('hidden');

    if (currentQ.searchQuery) {
        fetchAndPlayMusic(currentQ.searchQuery);
    }

    // Esperar 5 segundos (música + lectura) y luego iniciar transición
    setTimeout(() => {
        stopAudio();
        nextQuestion();
    }, 5000);
}

function nextQuestion() {
    // 1. Iniciar Animación de SALIDA
    gameUi.classList.add('content-exit');
    infoContentBox.classList.add('content-exit');

    // 2. Esperar 500ms (lo que dura la animación CSS) antes de cambiar los datos
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 500);
}

function showResults() {
    // Ocultar juego con transición también si se desea, o directo
    gameUi.classList.add('hidden');
    infoPanel.classList.add('hidden'); 
    resultsUi.classList.remove('hidden');
    resultsUi.classList.add('content-enter'); // Animación de entrada para resultados
    
    finalScoreEl.innerText = score;

    if (score === 10) {
        finalRankEl.innerText = "RANGO: POETA DE LA GENERACIÓN";
        finalMsgEl.innerText = "¡Perfección absoluta! Eres el fan #1 indiscutible.";
    } else if (score >= 8) {
        finalRankEl.innerText = "RANGO: FAN DE HUESO COLORADO";
        finalMsgEl.innerText = "¡Increíble! Conoces casi todo sobre Humbe.";
    } else if (score >= 5) {
        finalRankEl.innerText = "RANGO: ESCUCHA HABITUAL";
        finalMsgEl.innerText = "Nada mal, pero te falta escuchar más 'Entropía'.";
    } else {
        finalRankEl.innerText = "RANGO: TURISTA MUSICAL";
        finalMsgEl.innerText = "Te recomendamos empezar por 'El Poeta' y volver a intentar.";
    }

    resultsListEl.innerHTML = ''; 
    userAnswers.forEach((ans, index) => {
        const item = document.createElement('div');
        item.classList.add('summary-item');
        item.classList.add(ans.isCorrect ? 'correct-item' : 'wrong-item');
        
        const icon = ans.isCorrect ? '✓' : '✕';
        
        item.innerHTML = `
            <div>
                <span class="summary-icon">${icon}</span> P${index + 1}
            </div>
            <div style="font-size: 0.8rem; opacity: 0.8;">
                ${ans.isCorrect ? 'Correcta' : 'Era: ' + ans.correctAnswer}
            </div>
        `;
        resultsListEl.appendChild(item);
    });

    dynamicLight.color.setHex(0xbc13fe);
    innerHeadMat.emissive.setHex(0x2a004a);
}