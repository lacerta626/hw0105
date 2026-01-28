// indexscript.js

const clickBtn = document.getElementById("clickBtn");
const dday = document.getElementById("dday");
const loadingBar = document.getElementById('loading-bar');
const loadingScreen = document.getElementById('loading-screen');

// --- 1. Toyfight 스타일 페이지 전환 효과 ---
clickBtn.addEventListener("click", () => {
    // 기둥 레이어 클릭 허용 (애니메이션 동안 다른 클릭 방지)
    document.getElementById("transition-layer").style.pointerEvents = "auto";

    // GSAP 애니메이션 실행
    gsap.to(".column", {
        duration: 0.8,
        y: "0%",             // 아래에서 위로 올라옴
        stagger: 0.1,        // 기둥마다 0.1초 차이 (Toyfight 핵심)
        ease: "power4.inOut",
        onComplete: () => {
            // 모든 기둥이 다 올라오면 페이지 이동
            window.location.href = "board/board.html";
        }
    });
});

// --- 2. 디데이 계산 ---
const startDate = new Date("2026-01-05");
const today = new Date();
const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
if (dday) dday.textContent = `DAY ${diffDays}`;

// --- 3. 로딩 시뮬레이션 ---
window.addEventListener('load', () => {
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('finished');
                
                // 캐릭터 초기 대사창 활성화
                const b1 = document.getElementById("bubble-1");
                const b2 = document.getElementById("bubble-2");
                b1.classList.add("show");
                b2.classList.add("show");

                setTimeout(() => {
                    b1.classList.remove("show");
                    b2.classList.remove("show");
                }, 5000);

                // 6초 뒤 버튼 안내창 띄우기
                setTimeout(() => {
                    const guideBubble = document.getElementById("btn-guide-bubble");
                    if (guideBubble) guideBubble.classList.add("show");
                }, 6000);

            }, 500);
        } else {
            width += Math.random() * 15;
            if (width > 100) width = 100;
            loadingBar.style.width = width + '%';
        }
    }, 150);
});

// --- 4. 캐릭터 대사 로직 ---
const scripts1 = ["형 뭐해?", "우리 형 귀엽지?", "형이 좋아", "형 생각"];
const scripts2 = ["현아 뭐해?", "우리 현이 귀엽지~", "네가 좋아", "현이 생각"];
let timer1, timer2;

function showMessage(bubbleId, scripts, timerVar) {
    const bubble = document.getElementById(bubbleId);
    clearTimeout(timerVar);
    const randomText = scripts[Math.floor(Math.random() * scripts.length)];
    bubble.innerText = randomText;
    bubble.classList.remove("show");
    void bubble.offsetWidth; // 리플로우
    bubble.classList.add("show");
    return setTimeout(() => { bubble.classList.remove("show"); }, 2500);
}

document.getElementById("char-1").addEventListener("click", () => {
    timer1 = showMessage("bubble-1", scripts1, timer1);
});
document.getElementById("char-2").addEventListener("click", () => {
    timer2 = showMessage("bubble-2", scripts2, timer2);
});