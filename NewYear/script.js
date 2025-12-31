// Enhanced interactions: countdown, confetti, slideshow, and YouTube music control

// --- Countdown to next Jan 1 ---
function getNextNewYear() {
    const now = new Date();
    const year = now.getFullYear();
    const nextYear = new Date(year + 1, 0, 1);
    if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() === 0) {
        return new Date(year, 0, 1);
    }
    return nextYear;
}

function updateCountdown() {
    const target = getNextNewYear();
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) return;
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    document.getElementById('days').textContent = String(days).padStart(2,'0');
    document.getElementById('hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// --- Simple confetti using canvas ---
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;
let confettiPieces = [];

function resizeCanvas(){
    if(!ctx) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = 300; // limited to container height
}

function createConfetti(x){
    const colors = ['#fdcb6e','#00b894','#0984e3','#e17055','#d63031'];
    for(let i=0;i<80;i++){
        confettiPieces.push({
            x: x + (Math.random()-0.5)*200,
            y: 0,
            vx: (Math.random()-0.5)*6,
            vy: Math.random()*6+2,
            size: Math.random()*6+3,
            color: colors[Math.floor(Math.random()*colors.length)],
            rot: Math.random()*360
        });
    }
}

function drawConfetti(){
    if(!ctx) return;
    ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    confettiPieces.forEach((p, idx)=>{
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.rot += 6;
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
        if(p.y > confettiCanvas.height+50) confettiPieces.splice(idx,1);
    });
    requestAnimationFrame(drawConfetti);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawConfetti();

document.getElementById('celebrate').addEventListener('click', ()=>{
    createConfetti(window.innerWidth/2);
});

// --- Slideshow: preload images from the local `pic` folder ---
let images = [
    'pic/pic1.jpeg',
    'pic/pic2.jpeg',
    'pic/pic3.jpeg',
    'pic/pic4.jpeg',
    'pic/pic5.jpeg',
    'pic/pic6.jpeg',
    'pic/pic7.jpeg',
    'pic/pic8.jpeg'
];
let current = 0;
const slideImg = document.getElementById('slide');

function showImage(){
    if(images.length === 0){
        slideImg.src = '';
        slideImg.alt = 'No photos yet';
        return;
    }
    slideImg.src = images[current];
    slideImg.alt = `Memory ${current+1} of ${images.length}`;
}

document.getElementById('prev').addEventListener('click', ()=>{
    if(images.length===0) return;
    current = (current - 1 + images.length) % images.length;
    showImage();
});
document.getElementById('next').addEventListener('click', ()=>{
    if(images.length===0) return;
    current = (current + 1) % images.length;
    showImage();
});

// show first image on load
showImage();

// --- YouTube embed + simple play/pause ---
let player;
function onYouTubeIframeAPIReady(){
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'BIqC-6pkT0o',
        playerVars: { 'playsinline': 1 }
    });
}

const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
document.body.appendChild(tag);

const musicToggle = document.getElementById('music-toggle');
musicToggle.addEventListener('click', ()=>{
    if(!player){
        musicToggle.textContent = 'Loading...';
        return;
    }
    const state = player.getPlayerState();
    // states: 1=playing, 2=paused
    if(state === 1){
        player.pauseVideo(); musicToggle.textContent = 'Play Music';
    } else {
        player.playVideo(); musicToggle.textContent = 'Pause Music';
    }
});

// Small friendly alert after load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // gentle greeting (non-blocking)
        const el = document.createElement('div');
        el.style.position='fixed';el.style.bottom='18px';el.style.right='18px';el.style.background='rgba(0,0,0,0.6)';el.style.color='white';el.style.padding='10px 14px';el.style.borderRadius='10px';el.style.zIndex=9999;
        el.textContent = 'Happy New Year, Pallu! Click "Play Music" and "Celebrate" to start.';
        document.body.appendChild(el);
        setTimeout(()=>el.remove(),8000);
    }, 1200);
});
