// ========== API設定 ==========
const API_BASE = 'https://api.reasonchan.xyz';

// ========== 初期化 ==========
document.addEventListener('DOMContentLoaded', function () {
    loadImages();
    initializeEventListeners();
});

// ========== イベントリスナー初期化 ==========
function initializeEventListeners() {
    // ソートボタン
    document.querySelectorAll('.btn-sort').forEach(button => {
        button.addEventListener('click', handleSort);
    });

    // ファイルアップロード
    document.getElementById('fileInput').addEventListener('change', handleUpload);

    // モーダル閉じる
    const modal = document.getElementById('imageModal');
    document.querySelector('.close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeModal();
    });
}

// ========== 画像一覧をAPIから取得 ==========
async function loadImages() {
    try {
        const res = await fetch(`${API_BASE}/images`);
        const images = await res.json();
        const grid = document.querySelector('.gallery-grid');
        grid.innerHTML = '';
        images.forEach(imageData => addImageToGallery(imageData));
    } catch (err) {
        console.error('画像の読み込みに失敗しました:', err);
    }
}

// ========== ギャラリーアイテムを追加 ==========
function addImageToGallery(imageData, prepend = false) {
    const grid = document.querySelector('.gallery-grid');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.id = imageData.id;
    item.dataset.date = imageData.created_at.split('T')[0];
    item.dataset.likes = imageData.likes;

    item.innerHTML = `
        <div class="image-container">
            <img src="${API_BASE}/uploads/${imageData.filename}"
                 alt="${imageData.original_name}" class="gallery-image">
        </div>
        <div class="image-info">
            <div class="info-left">
                <span class="date">${imageData.created_at.split('T')[0]}</span>
            </div>
            <div class="info-right">
                <span class="like-count">${imageData.likes}</span>
            </div>
        </div>
        <div class="action-buttons">
            <button class="btn btn-like">
                <span class="heart">♡</span>
                <span class="like-text">いいね</span>
            </button>
            <button class="btn btn-visit">Xへ移動</button>
        </div>
    `;

    item.querySelector('.btn-like').addEventListener('click', handleLike);
    item.querySelector('.btn-visit').addEventListener('click', handleVisit);
    item.querySelector('.gallery-image').addEventListener('click', handleImageClick);

    if (prepend) {
        grid.prepend(item);
    } else {
        grid.appendChild(item);
    }
}

// ========== 画像アップロード ==========
async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const status = document.getElementById('uploadStatus');
    status.textContent = 'アップロード中...';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        status.textContent = 'アップロード完了！';
        addImageToGallery(data, true);

        // 3秒後にステータスメッセージを消す
        setTimeout(() => { status.textContent = ''; }, 3000);
    } catch (err) {
        status.textContent = 'エラーが発生しました';
        console.error(err);
    }

    // ファイル選択をリセット（同じファイルを再アップロードできるように）
    event.target.value = '';
}

// ========== ソート ==========
function handleSort(event) {
    const sortType = event.target.dataset.sort;
    const galleryGrid = document.querySelector('.gallery-grid');
    const items = Array.from(document.querySelectorAll('.gallery-item'));

    document.querySelectorAll('.btn-sort').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (sortType === 'date') {
        items.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
    } else if (sortType === 'likes') {
        items.sort((a, b) => parseInt(b.dataset.likes) - parseInt(a.dataset.likes));
    }

    items.forEach(item => galleryGrid.appendChild(item));
}

// ========== いいね（APIと同期） ==========
async function handleLike(event) {
    event.preventDefault();

    const btn = event.currentTarget;
    const galleryItem = btn.closest('.gallery-item');
    const id = galleryItem.dataset.id;
    const likeCountElement = galleryItem.querySelector('.like-count');
    const heart = btn.querySelector('.heart');

    // アニメーション
    heart.style.animation = 'none';
    void heart.offsetWidth; // reflow
    heart.style.animation = 'likeAnimation 0.4s ease forwards';

    try {
        const res = await fetch(`${API_BASE}/likes/${id}`, { method: 'POST' });
        const data = await res.json();

        // APIから返ってきた最新のいいね数で更新
        galleryItem.dataset.likes = data.likes;
        likeCountElement.textContent = data.likes;

        // ボタンをいいね済み状態に
        btn.classList.add('liked');
        heart.textContent = '♥';
    } catch (err) {
        console.error('いいねの送信に失敗しました:', err);
    }
}

// いいねアニメーション
const style = document.createElement('style');
style.textContent = `
    @keyframes likeAnimation {
        0%   { transform: scale(1); }
        40%  { transform: scale(1.4); }
        70%  { transform: scale(0.95); }
        100% { transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// ========== Xへ移動 ==========
function handleVisit(event) {
    event.preventDefault();
    window.open('https://twitter.com', '_blank');
}

// ========== 画像拡大 ==========
function handleImageClick(event) {
    const modal = document.getElementById('imageModal');
    document.querySelector('.modal-image').src = event.target.src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ========== モーダル閉じる ==========
function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

// ========== リアルタイム同期（30秒ごとにいいね数を更新） ==========
setInterval(async () => {
    const items = document.querySelectorAll('.gallery-item');
    for (const item of items) {
        const id = item.dataset.id;
        if (!id) continue;
        try {
            const res = await fetch(`${API_BASE}/likes/${id}`);
            const data = await res.json();
            item.dataset.likes = data.likes;
            item.querySelector('.like-count').textContent = data.likes;
        } catch (err) {
            // サイレントに失敗
        }
    }
}, 30000);
