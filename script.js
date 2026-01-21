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

// 모든 아이템 목록 (images/ 폴더 기준)
const allItems = [
    { src: 'images/hyeon.png', name: '소파' },
    { src: 'images/lamp.png', name: '램프' },
    { src: 'images/won.png', name: '식물' },
    { src: 'images/chair.png', name: '의자' },
    { src: 'images/table.png', name: '테이블' },
    { src: 'images/bed.png', name: '침대' },
    { src: 'images/clock.png', name: '시계' },
    { src: 'images/picture.png', name: '그림' },
    { src: 'images/rug.png', name: '러그' },
    { src: 'images/shelf.png', name: '선반' },
    // 여기에 20~30개 더 추가하세요...
    // 예: { src: 'images/curtain.png', name: '커튼' },
];

const ITEMS_PER_PAGE = 10;
let currentPage = 0;
const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

const itemsContainer = document.getElementById('items-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// 페이지 렌더링 함수
function renderPage(page) {
    itemsContainer.innerHTML = ''; // 기존 내용 지우기
    
    const start = page * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = allItems.slice(start, end);
    
    pageItems.forEach(item => {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name;
        img.className = 'draggable';
        img.draggable = true;
        img.width = 80;
        img.height = 80;
        
        // 드래그 시작 시 src 저장 (기존 dragstart 이벤트 유지)
        img.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', img.src);
        });
        
        itemsContainer.appendChild(img);
    });
    
    // 페이지 정보 업데이트
    pageInfo.textContent = `${page + 1} / ${totalPages}`;
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === totalPages - 1;
}

// 버튼 이벤트
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderPage(currentPage);
    }
});

// 초기 로드
renderPage(0);