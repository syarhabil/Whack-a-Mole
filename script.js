const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const timeBoard = document.getElementById('time');
const moles = document.querySelectorAll('.mole');
const hitSound = document.getElementById('hitSound');
const missSound = document.getElementById('missSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const gameOverModal = document.getElementById('gameOverModal');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartGame');
const shareWhatsApp = document.getElementById('shareWhatsApp');
const shareInstagram = document.getElementById('shareInstagram');
const startButton = document.getElementById('startGame');
const startModal = document.getElementById('startModal');
const closeStartModal = document.getElementById('closeStartModal');

let lastHole;
let timeUp = false;
let score = 0;
let time = 30;
let gameTimer;

// Tampilkan modal pop-up awal
startModal.style.display = 'flex';

// Tutup modal awal saat tombol "Mulai Game" diklik
closeStartModal.addEventListener('click', () => {
    startModal.style.display = 'none';
});

// Fungsi untuk memulai permainan
function startGame() {
    scoreBoard.textContent = 0;
    score = 0;
    time = 30;
    timeBoard.textContent = time;
    timeUp = false;

    // Mainkan musik latar
    backgroundMusic.currentTime = 0;  // Reset music ke awal
    backgroundMusic.volume = 0.5;      // Set volume musik ke 50%
    backgroundMusic.play().catch(error => {
        console.log("Error playing background music:", error);
    });

    peep();  // Mulai muncul mole
    gameTimer = setInterval(countdown, 1000);  // Timer game berjalan setiap detik
    setTimeout(() => {
        timeUp = true;
        clearInterval(gameTimer);
        endGame();  // Ketika waktu habis, akhiri permainan
    }, 30000);  // Game berlangsung selama 30 detik
}

// Fungsi untuk mengakhiri permainan
function endGame() {
    // Hentikan musik latar
    backgroundMusic.pause();

    // Mainkan suara game over (miss sound)
    missSound.currentTime = 0;
    missSound.play();

    // Tampilkan modal dengan skor akhir
    finalScore.textContent = score;
    gameOverModal.style.display = 'flex';  // Tampilkan modal
}

// Menghasilkan waktu acak untuk mole muncul
function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// Pilih lubang secara acak untuk mole muncul
function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

// Fungsi untuk membuat mole muncul secara acak
function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.querySelector('.mole').classList.add('up');
    setTimeout(() => {
        hole.querySelector('.mole').classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

// Fungsi countdown untuk mengurangi waktu
function countdown() {
    time--;
    timeBoard.textContent = time;
}

// Fungsi ketika mole dipukul (bonk)
function bonk(e) {
    if (!e.isTrusted) return;  // Cegah klik palsu (cheating)

    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;

    // Mainkan suara hit
    hitSound.currentTime = 0;  // Reset sound
    hitSound.play();
}

// Fungsi untuk mereset permainan (kembali ke kondisi awal)
function resetGame() {
    timeUp = true;
    clearInterval(gameTimer);  // Hentikan timer
    score = 0;
    time = 30;
    scoreBoard.textContent = score;
    timeBoard.textContent = time;

    // Hentikan musik latar (jika sedang berjalan)
    backgroundMusic.pause();

    // Sembunyikan modal
    gameOverModal.style.display = 'none';
}

// Event listener untuk tombol restart
restartButton.addEventListener('click', function() {
    resetGame();  // Reset game dan kembali ke kondisi awal
});

// Event listener untuk tombol start game (memulai game dari awal)
startButton.addEventListener('click', function() {
    resetGame(); // Pastikan kondisi direset sebelum mulai game baru
    startGame(); // Memulai game
});

// Fungsi untuk share skor ke WhatsApp
shareWhatsApp.addEventListener('click', function() {
    const gameUrl = 'https://syarhabil.github.io/Whack-a-Mole/';  // URL GitHub Pages
    const message = `Saya mendapatkan score ${score} di game "Whack-a-Mole"! Ayo mainkan juga di sini: https://syarhabil.github.io/Whack-a-Mole/`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});


// Fungsi untuk share ke Instagram (mengarahkan ke kamera cerita Instagram)
shareInstagram.addEventListener('click', function() {
    const message = `Saya mendapatkan score ${score} di game "Whack-a-Mole"! Ayo mainkan juga!`;
    alert(`Bagikan skor ini di Instagram: "${message}"`);
    const instagramUrl = `instagram://story-camera`;  // Buka Instagram Stories kamera
    window.open(instagramUrl, '_blank');
});

// Fungsi untuk mengambil screenshot saat game over
document.getElementById('screenshotBtn').addEventListener('click', function() {
    const gameElement = document.querySelector('.container'); // Elemen game yang akan discreenshot
    
    html2canvas(gameElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'Game_Whack-a-Mole_by_Syarhabil.png'; // Nama file screenshot
        link.click(); // Simpan screenshot
    });
});


// Menambahkan event listener untuk klik pada mole
moles.forEach(mole => mole.addEventListener('click', bonk));
