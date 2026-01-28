window.addEventListener('load', () => {
    // 1. 기둥 사라지는 애니메이션 (전입 효과)
    gsap.to(".column", {
        duration: 0.8,
        y: "100%", 
        stagger: 0.1,
        ease: "power4.inOut",
        onComplete: () => {
            document.getElementById("transition-layer").style.display = "none";
        }
    });

    // 2. 대시보드 카드들이 순차적으로 나타나는 효과 추가
    gsap.from(".card", {
        duration: 0.6,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5
    });
});

// 간단한 온도 슬라이더 반응 (선택 사항)
const slider = document.querySelector('.temp-slider');
const tempDisplay = document.querySelector('.temp-value');

if(slider) {
    slider.addEventListener('input', (e) => {
        const val = Math.floor(e.target.value / 4) + 18; // 18~40도 시뮬레이션
        tempDisplay.textContent = `${val}°C`;
    });
}
// [추가] SECURITY 메뉴 클릭 시 trpg.html로 이동
    const securityBtn = document.getElementById("go-trpg");
    
    if (securityBtn) {
        securityBtn.addEventListener("click", () => {
            // 다시 기둥 레이어를 보이게 함
            const layer = document.getElementById("transition-layer");
            layer.style.display = "flex";
            layer.style.pointerEvents = "auto";

            // 기둥이 아래에서 위로 올라오는 애니메이션
            gsap.to(".column", {
                duration: 0.8,
                y: "0%",             // 다시 화면을 채움
                stagger: 0.1,
                ease: "power4.inOut",
                onComplete: () => {
                    window.location.href = "../trpg/trpg.html";
                }
            });
        });
    }
