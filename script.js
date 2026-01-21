// 캔버스 초기화
var canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff' // 캔버스 배경색
});

// 배경 이미지 로드 (빈 방 이미지 예시, 실제 PNG로 교체)
fabric.Image.fromURL('images/room-background.png', function(img) {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
    });
});

// 드래그 앤 드롭 이벤트
var draggableImages = document.querySelectorAll('.draggable');
draggableImages.forEach(function(img) {
    img.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', img.src); // 이미지 URL 전달
    });
});

// 캔버스에 드롭 이벤트
canvas.wrapperEl.addEventListener('dragover', function(e) {
    e.preventDefault();
});

canvas.wrapperEl.addEventListener('drop', function(e) {
    e.preventDefault();
    var imgSrc = e.dataTransfer.getData('text/plain');
    var rect = canvas.wrapperEl.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    // 드롭된 위치에 이미지 추가
    fabric.Image.fromURL(imgSrc, function(oImg) {
        oImg.set({
            left: x,
            top: y,
            scaleX: 0.5, // 초기 크기 조정
            scaleY: 0.5
        });
        canvas.add(oImg);
        canvas.renderAll();
    });
});
// 키보드 삭제 기능
document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();   // 선택 해제
            canvas.renderAll();
        }
    }
});
// 삭제 버튼
const deleteBtn = document.getElementById('deleteBtn');

deleteBtn.addEventListener('click', function() {
    const active = canvas.getActiveObject();
    if (active) {
        canvas.remove(active);
        canvas.discardActiveObject();
        canvas.renderAll();
        deleteBtn.disabled = true;  // 삭제 후 비활성화
    }
});

// 선택 상태에 따라 버튼 활성화/비활성화
canvas.on('selection:created', function() {
    deleteBtn.disabled = false;
});
canvas.on('selection:updated', function() {
    deleteBtn.disabled = false;
});
canvas.on('selection:cleared', function() {
    deleteBtn.disabled = true;
});