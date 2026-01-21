// 캔버스 초기화
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff',
    selection: true,          // 선택 가능 명시
    allowTouchScrolling: true // 모바일 스크롤 방지 안 함
});

// 배경 이미지 로드
fabric.Image.fromURL('images/room-background.png', function(img) {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
    });
});

// === PC 드래그 앤 드롭 (정확한 위치 계산) ===
canvas.wrapperEl.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
});

canvas.wrapperEl.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const imgSrc = e.dataTransfer.getData('text/plain');
    if (!imgSrc) return;

    // 핵심: Fabric.js 내장 getPointer로 정확한 내부 좌표 구함 (zoom/pan/offset 보정)
    const pointer = canvas.getPointer(e, true);  // true = ignoreZoom false (현재 zoom 반영)

    fabric.Image.fromURL(imgSrc, function(oImg) {
        oImg.set({
            left: pointer.x,
            top: pointer.y,
            scaleX: 0.5,
            scaleY: 0.5,
            originX: 'center',   // 마우스 위치를 이미지 중앙으로 → 직관적
            originY: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true // 뒤집히는 거 방지 (선택적)
        });

        canvas.add(oImg);
        canvas.setActiveObject(oImg); // 바로 선택 상태 → 핸들 바로 뜸
        canvas.requestRenderAll();

        if (typeof saveCanvas === 'function') saveCanvas(); // localStorage 있으면 호출
    }, { crossOrigin: 'anonymous' });
});

// === 모바일/PC 공통: 클릭(탭)으로 중앙 추가 ===
document.querySelectorAll('.draggable').forEach(img => {
    img.addEventListener('click', function(e) {
        e.preventDefault();
        const src = img.src;

        fabric.Image.fromURL(src, function(oImg) {
            oImg.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                scaleX: 0.5,
                scaleY: 0.5,
                originX: 'center',
                originY: 'center',
                selectable: true,
                hasControls: true
            });
            canvas.add(oImg);
            canvas.setActiveObject(oImg);
            canvas.requestRenderAll();

            if (typeof saveCanvas === 'function') saveCanvas();
        });
    });
});

// 키보드 삭제 (PC용)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            if (typeof saveCanvas === 'function') saveCanvas();
        }
    }
});

// 삭제 버튼
const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
        const active = canvas.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            deleteBtn.disabled = true;
            if (typeof saveCanvas === 'function') saveCanvas();
        }
    });

    // 선택 상태 연동
    canvas.on({
        'selection:created': () => { deleteBtn.disabled = false; },
        'selection:updated': () => { deleteBtn.disabled = false; },
        'selection:cleared': () => { deleteBtn.disabled = true; }
    });
}

// 페이지네이션 부분 (기존 유지, 하지만 draggable 이벤트 중복 제거)
const allItems = [
    { src: 'images/hyeon.png', name: '소파' },
    { src: 'images/lamp.png', name: '램프' },
    { src: 'images/won.png', name: '식물' },
    { src: 'images/bookshelf_black.png', name: '의자' },
    { src: 'images/rabbit_green.png', name: '테이블' },
    { src: 'images/bed.png', name: '침대' },
    { src: 'images/clock.png', name: '시계' },
    { src: 'images/picture.png', name: '그림' },
    { src: 'images/rug.png', name: '러그' },
    { src: 'images/shelf.png', name: '선반' },
    // 추가 아이템...
];

const ITEMS_PER_PAGE = 10;
let currentPage = 0;
const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

const itemsContainer = document.getElementById('items-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

function renderPage(page) {
    itemsContainer.innerHTML = '';
    const start = page * ITEMS_PER_PAGE;
    const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE);

    pageItems.forEach(item => {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name;
        img.className = 'draggable';
        img.draggable = true;
        img.width = 80;
        img.height = 80;

        // PC dragstart만 붙임 (모바일은 click 이벤트 위에서 처리)
        img.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', img.src);
        });

        itemsContainer.appendChild(img);
    });

    pageInfo.textContent = `${page + 1} / ${totalPages}`;
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === totalPages - 1;
}

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

renderPage(0);