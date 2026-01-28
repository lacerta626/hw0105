const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    // 마우스의 X, Y 좌표를 가져와서 커서 위치 업데이트
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
});

// 마우스가 화면을 벗어나면 커서를 숨깁니다
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});