const params = new URLSearchParams(location.search);
const id = params.get('id');

if (!id) {
    document.getElementById('trpg-content').textContent =
        '잘못된 접근입니다.';
} else {
    fetch(`data/${id}.html`)
        .then(res => {
            if (!res.ok) throw new Error('파일 없음');
            return res.text();
        })
        .then(html => {
            document.getElementById('trpg-content').innerHTML = html;
        })
        .catch(() => {
            document.getElementById('trpg-content').textContent =
                'TRPG 데이터를 불러올 수 없습니다.';
        });
}
