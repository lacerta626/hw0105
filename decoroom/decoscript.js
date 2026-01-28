// 1. 캔버스 초기화 (기존 로직 유지)
const canvas = new fabric.Canvas('canvas', {
    backgroundColor: '#ffffff',
    selection: true
});
canvas.setBackgroundColor('#ebfcff', canvas.renderAll.bind(canvas));

// 2. 아이템 데이터 (기존 데이터 유지)
const BASE = '/hw0105';
const allItems = [
    { src: `${BASE}/images/room/hyeon.png`, name: '현' },
    { src: `${BASE}/images/room/bear_purple.png`, name: '곰인형' },
    { src: `${BASE}/images/room/won.png`, name: '원' },
    { src: `${BASE}/images/room/rabbit_green.png`, name: '토끼인형' },
    { src: `${BASE}/images/room/bookshelf_black.png`, name: '책장' },
    { src: `${BASE}/images/room/fish_green.png`, name: '초록' },
    { src: `${BASE}/images/room/fish_pink.png`, name: '분홍' },
    { src: `${BASE}/images/room/fishcarpet_blue.png`, name: '카페트' },
    { src: `${BASE}/images/room/bench.png`, name: '벤치' },
    { src: `${BASE}/images/room/fish.png`, name: '낚시대' }
];

const ITEMS_PER_PAGE = 6; // 화면 구성을 위해 조금 줄임
let currentPage = 0;
const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

const itemsContainer = document.getElementById('items-container');
const pageInfo = document.getElementById('pageInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// 3. 아이템 렌더링 함수
function renderPage(page) {
    itemsContainer.innerHTML = '';
    const start = page * ITEMS_PER_PAGE;
    const pageItems = allItems.slice(start, start + ITEMS_PER_PAGE);

    pageItems.forEach(item => {
        const img = document.createElement('img');
        img.src = item.src;
        img.className = 'draggable';
        img.onclick = () => addItem(item.src);
        itemsContainer.appendChild(img);
    });

    pageInfo.textContent = `${page + 1} / ${totalPages}`;
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === totalPages - 1;
}

function addItem(src) {
    fabric.Image.fromURL(src, oImg => {
        oImg.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: 0.5,
            scaleY: 0.5,
            originX: 'center',
            originY: 'center'
        });
        canvas.add(oImg);
        canvas.setActiveObject(oImg);
    }, { crossOrigin: 'anonymous' });
}

// 4. 삭제 및 이벤트 핸들링
const deleteBtn = document.getElementById('deleteBtn');
deleteBtn.addEventListener('click', () => {
    const active = canvas.getActiveObject();
    if (active) {
        canvas.remove(active);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
});

canvas.on('selection:created', () => deleteBtn.disabled = false);
canvas.on('selection:cleared', () => deleteBtn.disabled = true);

prevBtn.onclick = () => { if (currentPage > 0) renderPage(--currentPage); };
nextBtn.onclick = () => { if (currentPage < totalPages - 1) renderPage(++currentPage); };

renderPage(0);