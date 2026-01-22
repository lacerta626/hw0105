// 캔버스 초기화
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff',
    selection: true,
    allowTouchScrolling: true
});
canvas.setBackgroundColor('#ebfcff', canvas.renderAll.bind(canvas));
// // 배경 이미지 로드 - 비율 유지하며 확대
// fabric.Image.fromURL('images/room-background.png', function (img) {
//     const scaleFactor = 1.3;  // 1.3배 확대 (원하시면 1.2, 1.4, 1.5 등으로 변경)

//     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//         // scaleX와 scaleY를 동일하게 설정 → 비율 유지
//         scaleX: scaleFactor,
//         scaleY: scaleFactor,
//         // 중앙 정렬 (필요 시)
//         originX: 'center',
//         originY: 'center',
//         left: canvas.width / 2,
//         top: canvas.height / 2,
//         crossOrigin: 'anonymous'
//     });
// });

// PC 드래그 앤 드롭 (캔버스 영역) - 이벤트 선점 방지 추가
canvas.wrapperEl.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    // 추가: 캔버스 위에서 드래그 중일 때 커서 기본값 유지 (사이드바 이벤트 보호)
    canvas.wrapperEl.style.cursor = 'default';
});

canvas.wrapperEl.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();

    // 추가: drop 직전에도 커서 복구 (필요 시)
    canvas.wrapperEl.style.cursor = 'default';

    const imgSrc = e.dataTransfer.getData('text/plain');
    if (!imgSrc) return;

    const pointer = canvas.getPointer(e, true);

    fabric.Image.fromURL(imgSrc, function (oImg) {
        oImg.set({
            left: pointer.x,
            top: pointer.y,
            scaleX: 0.5,
            scaleY: 0.5,
            originX: 'center',
            originY: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockScalingFlip: true
        });

        canvas.add(oImg);
        canvas.setActiveObject(oImg);
        canvas.requestRenderAll();

        if (typeof saveCanvas === 'function') saveCanvas();
    }, { crossOrigin: 'anonymous' });
});

// 아이템 목록
const allItems = [
    { src: '/hw0105/images/room/hyeon.png', name: '현' },
    { src: '/hw0105/images/room/bear_purple.png', name: '곰인형' },
    { src: '/hw0105/images/room/won.png', name: '원' },
    { src: '/hw0105/images/room/rabbit_green.png', name: '토끼인형' },
    { src: '/hw0105/images/room/bookshelf_black.png', name: '책장' },
    { src: '/hw0105/images/room/fish_green.png', name: '초록낚시대' },
    { src: '/hw0105/images/room/fish_pink.png', name: '분홍낚시대' },
    { src: '/hw0105/images/room/fishcarpet_blue.png', name: '물고기카펫_파랑' },
    { src: '/hw0105/images/room/bench.png', name: '벤치' },
    { src: '/hw0105/images/room/fish.png', name: '파란낚시대' },
    { src: '/hw0105/images/room/fish_wall.png', name: '히아신스벽' },
    { src: '/hw0105/images/room/fishfloor.png', name: '히아신스바닥' },
    { src: '/hw0105/images/room/cosmicfloor.png', name: '우주바닥' },
    { src: '/hw0105/images/room/cosmicwall_blue.png', name: '우주벽_파랑' },
    { src: '/hw0105/images/room/cosmicwall_purple.png', name: '우주벽_보라' },
    { src: '/hw0105/images/room/cosmicwall_green.png', name: '우주벽_초록' },
    { src: '/hw0105/images/room/basicfloor_black.png', name: '기본바닥_검정' },
    { src: '/hw0105/images/room/basicwall_black.png', name: '기본벽_검정' },
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
    itemsContainer.innerHTML = '';

    const start = page * ITEMS_PER_PAGE;
    const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE);

    pageItems.forEach(item => {
        const itemWrapper = document.createElement('div');
        itemWrapper.style.textAlign = 'center';
        itemWrapper.style.margin = '8px 4px';

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name;
        img.className = 'draggable';
        img.width = 80;
        img.height = 80;

        // draggable 강제 설정 + 인라인 스타일로 cursor 강제 (사이드바 이벤트 보호)
        img.setAttribute('draggable', 'true');
        img.draggable = true;
        img.style.cursor = 'grab';           // 추가: 인라인으로 grab 커서 강제
        img.style.pointerEvents = 'auto';    // 추가: 이벤트 확실히 전달
        img.style.userSelect = 'none';

        img.onload = () => {
            img.setAttribute('draggable', 'true');
            img.draggable = true;
            img.style.cursor = 'grab';
        };

        const label = document.createElement('div');
        label.textContent = item.name;
        label.style.fontSize = '12px';
        label.style.marginTop = '4px';
        label.style.color = '#333';
        label.style.whiteSpace = 'nowrap';
        label.style.overflow = 'hidden';
        label.style.textOverflow = 'ellipsis';

        itemWrapper.appendChild(img);
        itemWrapper.appendChild(label);
        itemsContainer.appendChild(itemWrapper);
    });

    pageInfo.textContent = `${page + 1} / ${totalPages}`;
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === totalPages - 1;
}

// 이벤트 위임 (드래그 & 클릭 모두) - 기존 유지
itemsContainer.addEventListener('dragstart', e => {
    const target = e.target.closest('img.draggable');
    if (target) {
        console.log('dragstart 성공:', target.src); // 디버깅용
        target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', target.src);
        e.dataTransfer.effectAllowed = 'move';
    }
});

itemsContainer.addEventListener('dragend', e => {
    const target = e.target.closest('img');
    if (target) target.classList.remove('dragging');
});

itemsContainer.addEventListener('click', e => {
    const target = e.target.closest('img.draggable');
    if (!target) return;

    e.preventDefault();
    const src = target.src;

    fabric.Image.fromURL(src, oImg => {
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

// 페이지네이션 버튼
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

// 키보드 삭제 (Delete / Backspace)
document.addEventListener('keydown', e => {
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
    deleteBtn.addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.requestRenderAll();
            deleteBtn.disabled = true;
            if (typeof saveCanvas === 'function') saveCanvas();
        }
    });

    canvas.on({
        'selection:created': () => { deleteBtn.disabled = false; },
        'selection:updated': () => { deleteBtn.disabled = false; },
        'selection:cleared': () => { deleteBtn.disabled = true; }
    });
}