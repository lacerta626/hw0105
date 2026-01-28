const clickBtn = document.getElementById("clickBtn");
    const popupImage = document.getElementById("popupImage");

    clickBtn.addEventListener("click", () => {
        popupImage.classList.toggle("show");
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            popupImage.classList.remove("show");
        }
    });
    // homescript.js

window.addEventListener('load', () => {
    // 페이지 로드 후 기둥을 아래로 내림
    gsap.to(".column", {
        duration: 0.8,
        y: "100%",          // 위로 사라지게 하고 싶다면 "-100%", 아래라면 "100%"
        stagger: 0.1,        // 순차적 시차 효과
        ease: "power4.inOut",
        onComplete: () => {
            // 애니메이션 종료 후 레이어 숨김 처리 (혹시 모를 클릭 방해 방지)
            document.getElementById("transition-layer").style.display = "none";
        }
    });
});