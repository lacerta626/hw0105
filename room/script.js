// 1. 캔버스 초기화 및 반응형 설정
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff',
    selection: true,
    allowTouchScrolling: true // 모바일에서 캔버스 위 터치 스크롤 허용 여부
});
canvas.setBackgroundColor('#ebfcff', canvas.renderAll.bind(canvas));

// [추가] 캔버스 반응형 리사이즈 함수
function resizeCanvas() {
    const wrapper = document.getElementById('canvas-wrapper');
    if (!wrapper) return;
    
    const targetWidth = wrapper.clientWidth;
    // 900:600 비율 유지 (1.5:1)
    const ratio = 600 / 900;
    
    // 모바일 등 화면이 작아질 때만 가변적으로 조절
    if (window.innerWidth <= 768) {
        canvas.setDimensions({
            width: targetWidth,
            height: targetWidth * ratio
        });
        // 내부 오브젝트들도 비율에 맞게 조정하고 싶다면 여기에 추가 로직 필요
    } else {
        canvas.setDimensions({ width: 900, height: 600 });
    }
    canvas.requestRenderAll();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // 초기 로드 시 실행

// 2. PC 드래그 앤 드롭 (이벤트 안정화)
canvas.wrapperEl.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    canvas.wrapperEl.style.cursor = 'copy'; // 드래그 시 커서 모양 변경
});

canvas.wrapperEl.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    canvas.wrapperEl.style.cursor = 'default';

    const imgSrc = e.dataTransfer.getData('text/plain');
    if (!imgSrc) return;

    // 캔버스 내 상대 좌표 계산
    const pointer = canvas.getPointer(e);

    fabric.Image.fromURL(imgSrc, function (oImg) {
        oImg.set({
            left: pointer.x,
            top: pointer.y,
            scaleX: 0.5,
            scaleY: 0.5,
            originX: 'center',
            originY: 'center',
            lockScalingFlip: true
        });
        
        // 터치 조작 편의성 강화 (조절점 크기 등)
        oImg.setControlsVisibility({ mtr: true }); // 회전 컨트롤 활성화
        setupMobileControls(oImg);

        canvas.add(oImg);
        canvas.setActiveObject(oImg);
        canvas.requestRenderAll();
    }, { crossOrigin: 'anonymous' });
});

// 3. 아이템 목록 및 페이지네이션
const BASE = '/hw0105';
const allItems = [
    { src: `${BASE}/images/room/hyeon.png`, name: '현' },
    { src: `${BASE}/images/room/bear_purple.png`, name: '곰인형' },
    { src: `${BASE}/images/room/won.png`, name: '원' },
    { src: `${BASE}/images/room/rabbit_green.png`, name: '토끼인형' },
    { src: `${BASE}/images/room/bookshelf_black.png`, name: '책장' },
    { src: `${BASE}/images/room/fish_green.png`, name: '초록낚시대' },
    { src: `${BASE}/images/room/fish_pink.png`, name: '분홍낚시대' },
    { src: `${BASE}/images/room/fishcarpet_blue.png`, name: '물고기카펫_파랑' },
    { src: `${BASE}/images/room/bench.png`, name: '벤치' },
    { src: `${BASE}/images/room/fish.png`, name: '파란낚시대' },
    { src: `${BASE}/images/room/fish_wall.png`, name: '히아신스벽' },
    { src: `${BASE}/images/room/fishfloor.png`, name: '히아신스바닥' },
    { src: `${BASE}/images/room/cosmicfloor.png`, name: '우주바닥' },
    { src: `${BASE}/images/room/cosmicwall_blue.png`, name: '우주벽_파랑' },
    { src: `${BASE}/images/room/cosmicwall_purple.png`, name: '우주벽_보라' },
    { src: `${BASE}/images/room/cosmicwall_green.png`, name: '우주벽_초록' },
    { src: `${BASE}/images/room/basicfloor_black.png`, name: '기본바닥_검정' },
    { src: `${BASE}/images/room/basicwall_black.png`, name: '기본벽_검정' }
];

const ITEMS_PER_PAGE = 10;
let currentPage = 0;
const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

const itemsContainer = document.getElementById('items-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

function renderPage(page) {
    if (!itemsContainer) return;
    itemsContainer.innerHTML = '';

    const start = page * ITEMS_PER_PAGE;
    const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE);

    pageItems.forEach(item => {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'item-item'; // CSS 관리를 위해 클래스 추가 권장

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.name;
        img.className = 'draggable';
        img.setAttribute('draggable', 'true');
        
        // 클릭/터치 이벤트 (모바일 대응 핵심)
        img.onclick = () => addItemToCanvas(item.src);

        const label = document.createElement('div');
        label.textContent = item.name;
        label.className = 'item-label';

        itemWrapper.appendChild(img);
        itemWrapper.appendChild(label);
        itemsContainer.appendChild(itemWrapper);
    });

    if (pageInfo) pageInfo.textContent = `${page + 1} / ${totalPages}`;
    if (prevBtn) prevBtn.disabled = page === 0;
    if (nextBtn) nextBtn.disabled = page === totalPages - 1;
}

// 아이템 추가 공통 함수 (클릭 & 드롭 겸용)
function addItemToCanvas(src) {
    fabric.Image.fromURL(src, oImg => {
        oImg.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: 0.5,
            scaleY: 0.5,
            originX: 'center',
            originY: 'center'
        });
        setupMobileControls(oImg);
        canvas.add(oImg);
        canvas.setActiveObject(oImg);
        canvas.requestRenderAll();
    }, { crossOrigin: 'anonymous' });
}

// [추가] 모바일용 컨트롤러 설정 (터치하기 쉽게)
function setupMobileControls(obj) {
    obj.set({
        transparentCorners: false,
        cornerColor: '#ff91a4',
        cornerStrokeColor: '#ff4d6d',
        borderColor: '#ff4d6d',
        cornerSize: window.innerWidth < 768 ? 14 : 10, // 모바일에서 크게
        padding: 5
    });
}

// 4. 이벤트 리스너 통합
itemsContainer.addEventListener('dragstart', e => {
    const target = e.target.closest('img.draggable');
    if (target) {
        target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', target.src);
    }
});

itemsContainer.addEventListener('dragend', e => {
    const target = e.target.closest('img');
    if (target) target.classList.remove('dragging');
});

// 페이지네이션
prevBtn.addEventListener('click', () => { if (currentPage > 0) renderPage(--currentPage); });
nextBtn.addEventListener('click', () => { if (currentPage < totalPages - 1) renderPage(++currentPage); });

// 삭제 로직 (통합)
function deleteActiveObject() {
    const active = canvas.getActiveObject();
    if (active) {
        if (active.type === 'activeSelection') {
            active.forEachObject(obj => canvas.remove(obj));
        } else {
            canvas.remove(active);
        }
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'Delete' || e.key === 'Backspace') deleteActiveObject();
});

const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteActiveObject);
    canvas.on('selection:created', () => deleteBtn.disabled = false);
    canvas.on('selection:updated', () => deleteBtn.disabled = false);
    canvas.on('selection:cleared', () => deleteBtn.disabled = true);
}

renderPage(0);