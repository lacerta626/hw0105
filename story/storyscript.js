function toggleReply(element) {
    // 클릭된 요소에 'open' 클래스 토글
    element.classList.toggle('open');
    
    // 클릭 시 살짝 눌리는 반동 효과 (Y2K 버튼 느낌)
    element.style.transform = 'scale(0.98) translate(4px, 4px)';
    setTimeout(() => {
        element.style.transform = element.classList.contains('open') 
            ? 'scale(1) translate(4px, 4px)' 
            : 'translate(0, 0)';
    }, 100);
}
// storyscript.js
document.querySelectorAll('.tweet-item').forEach(item => {
    item.addEventListener('click', function() {
        // 클릭 시 살짝 눌리는 애니메이션 효과
        this.style.transform = 'scale(0.98) translate(2px, 2px)';
        setTimeout(() => {
            this.style.transform = ''; 
        }, 100);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 진입 시 기둥이 내려가는 효과
    gsap.to(".column", {
        duration: 0.8,
        y: "100%", 
        stagger: 0.1,
        ease: "power4.inOut",
        onComplete: () => {
            document.getElementById("transition-layer").style.display = "none";
        }
    });
});

// 2. 페이지 이동 시 기둥이 올라오는 함수
function navigateWithTransition(url) {
    const layer = document.getElementById("transition-layer");
    layer.style.display = "flex";
    
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

// 3. 사이드바 메뉴에 이벤트 연결
document.querySelector(".nav-item:not(.active)").addEventListener("click", () => {
    navigateWithTransition("board.html"); // 대시보드로 이동 시
});