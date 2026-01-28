document.addEventListener('DOMContentLoaded', () => {
    // 1. 기둥 애니메이션 (등장 효과)
    // 기둥이 현재 0% (화면 덮음) 상태에서 100% (화면 아래로) 사라지게 합니다.
    gsap.to(".column", {
        duration: 0.8,
        y: "100%", 
        stagger: 0.1,
        ease: "power4.inOut",
        onComplete: () => {
            const layer = document.getElementById("transition-layer");
            if (layer) layer.style.display = "none";
        }
    });

    // 2. 위젯 등장 애니메이션 (기둥이 어느 정도 내려간 뒤 시작)
    gsap.from(".card, .welcome-card, .sidebar", {
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.4 // 기둥이 절반쯤 사라졌을 때 타다닥 나오게 함
    });
});

// 페이지 이동 시 기둥이 위로 올라오는 효과 (나갈 때)
function navigateWithTransition(url) {
    const layer = document.getElementById("transition-layer");
    layer.style.display = "flex";
    
    // 다시 위로 올리기 위해 100% 위치에서 0%로 이동
    gsap.set(".column", { y: "100%" }); 
    
    gsap.to(".column", {
        duration: 0.6,
        y: "0%",
        stagger: 0.05,
        ease: "power4.inOut",
        onComplete: () => {
            window.location.href = url;
        }
    });
}

// 페이지 이동 공통 함수
function navigateWithTransition(url) {
    const layer = document.getElementById("transition-layer");
    layer.style.display = "flex";
    layer.style.pointerEvents = "auto";

    gsap.to(".column", {
        duration: 0.6,
        y: "0%",
        stagger: 0.05,
        ease: "power4.inOut",
        onComplete: () => {
            window.location.href = url;
        }
    });
}

// 버튼 연결
document.getElementById("go-trpg")?.addEventListener("click", () => navigateWithTransition("../trpg/trpg.html"));
document.getElementById("go-room")?.addEventListener("click", () => navigateWithTransition("../decoroom/decoroom.html"));

// 온도 조절기 로직
const slider = document.querySelector('.temp-slider');
const tempDisplay = document.querySelector('.temp-value');

if(slider) {
    slider.addEventListener('input', (e) => {
        const val = Math.floor(e.target.value / 4) + 18;
        tempDisplay.textContent = `${val}°C`;
    });
}