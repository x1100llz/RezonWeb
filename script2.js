// ============================================================
//  画像データ（ここに追加するだけでOK）
//  各アイテムのフィールド:
//    src        : 画像パス or URL
//    alt        : alt テキスト（省略可）
//    date       : "YYYY-MM-DD" 形式
//    likes      : 初期いいね数（数値）
//    twitterUrl : 「Xへ移動」ボタンのリンク先
// ============================================================
const IMAGE_DATA = [
    {
        src: 'https://i.postimg.cc/PqR36jsM/HGl-M-Zb-EAAG6V0.jpg',
        alt: 'イラスト 1',
        date: '2026-04-23',
        likes: 4809,
        twitterUrl: 'https://x.com/ruto_desu/status/2047252172912640491?s=20'
    },
    {
        src: 'https://i.postimg.cc/9QSZKF0m/HHjf-H3b-IAEVa63.jpg',
        alt: 'イラスト 2',
        date: '2026-05-05',
        likes: 33,
        twitterUrl: 'https://x.com/Ichida_Ao/status/2051635900791296155?s=20'
    },
    {
        src: 'https://i.postimg.cc/mZwMRShW/HHjfv-Fnb-AAAg-HGu.jpg',
        alt: 'イラスト 3',
        date: '2026-05-5',
        likes: 202,
        twitterUrl: 'https://x.com/Ichida_Ao/status/2051635642262765619?s=20'
    },
    {
        src: 'https://i.postimg.cc/Y2n9bDhB/HGap48dbg-AA7Hx-Q.jpg',
        alt: 'イラスト 4',
        date: '2026-04-21',
        likes: 1033,
        twitterUrl: 'https://x.com/rxr_jp/status/2046549507182403939?s=20'
    },
    {
        src: 'https://i.postimg.cc/4NHJwJDY/HGZu-pra8AAa0i8.jpg',
        alt: 'イラスト 5',
        date: '2026-04-21',
        likes: 78,
        twitterUrl: 'https://x.com/kuronosekai_06/status/2046445108686733504?s=20'
    },
    {
        src: 'https://i.postimg.cc/yNxBgsyy/HFs-RLEMa-UAAJ-bp.jpg',
        alt: 'イラスト 6',
        date: '2026-04-12',
        likes: 6826,
        twitterUrl: 'https://x.com/emuemuke/status/2043267887943602665?s=20'
    },
    {
        src: 'https://i.postimg.cc/0NjxMP0Y/HFu-Suxub-IAAIGT5.jpg',
        alt: 'イラスト 7',
        date: '2026-04-13',
        likes: 394,
        twitterUrl: 'https://x.com/pankomeramen99/status/2043456628356501813?s=20'
    },
    {
        src: 'https://i.postimg.cc/8CcDJNmH/HFyjq-DUb-UAACJfr.jpg',
        alt: 'イラスト 8',
        date: '2026-04-13',
        likes: 213,
        twitterUrl: 'https://x.com/Cuit_1430tr/status/2043688278608707833?s=20'
    },
    {
        src: 'https://i.postimg.cc/Gptr8dxJ/HFxrenga-IAAa-b4.jpg',
        alt: 'イラスト 9',
        date: '2026-04-13',
        likes: 79,
        twitterUrl: 'https://x.com/kuronosekai_06/status/2043626511153152173?s=20'
    },
    {
        src: 'https://i.postimg.cc/Xvq3G4kr/HEpvts-Ga-EAAw0ez.jpg',
        alt: 'イラスト 10',
        date: '2026-03-30',
        likes: 93,
        twitterUrl: 'https://x.com/kuronosekai_06/status/2038564616431960470?s=20'
    },
    {
        src: 'https://i.postimg.cc/zfv5b8Fb/HF40Eysas-AEpf-Kp.jpg',
        alt: 'イラスト 11',
        date: '2026-04-15',
        likes: 414,
        twitterUrl: 'https://x.com/Sumutokoro71714/status/2044128540233494554?s=20'
    },
    {
        src: 'https://i.postimg.cc/6Qqw2tf4/HF9v-Cnab-EAEiu-Je.jpg',
        alt: 'イラスト 12',
        date: '2026-04-16',
        likes: 119,
        twitterUrl: 'https://x.com/Mei0xy/status/2044474851369636109?s=20'
    },
    {
        src: 'https://i.postimg.cc/wBMHygQm/HF-wv72b-QAA-jrn.jpg',
        alt: 'イラスト 13',
        date: '2026-04-16',
        likes: 221,
        twitterUrl: 'https://x.com/im_yudetama/status/2044617467226640559?s=20'
    },
    {
        src: 'https://i.postimg.cc/5trJ8Ts8/HGKy-PTqb0AA-jti.jpg',
        alt: 'イラスト 14',
        date: '2026-04-18',
        likes: 364,
        twitterUrl: 'https://x.com/Sumutokoro71714/status/2045393158784303558?s=20'
    },
    {
        src: 'https://i.postimg.cc/5trJ8Ts8/HGKy-PTqb0AA-jti.jpg',
        alt: 'イラスト 14',
        date: '2026-04-19',
        likes: 1561,
        twitterUrl: 'https://x.com/rxr_jp/status/2045744205276823607?s=20'
    },
];

// ============================================================
//  設定
// ============================================================
const ITEMS_PER_PAGE = 12;

// ============================================================
//  状態管理
// ============================================================
const state = {
    currentPage: 1,
    sortType: 'date',
    likedIds: new Set(),        // いいね済みのインデックスを管理
    likeCounts: {},             // 動的ないいね数を保持
};

// 初期いいね数をコピー
IMAGE_DATA.forEach((item, i) => {
    state.likeCounts[i] = item.likes;
});

// ============================================================
//  ソート＆ページングされたデータ取得
// ============================================================
function getSortedData() {
    const indexed = IMAGE_DATA.map((item, i) => ({ ...item, _id: i }));
    if (state.sortType === 'date') {
        return indexed.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    if (state.sortType === 'likes') {
        return indexed.sort((a, b) => state.likeCounts[b._id] - state.likeCounts[a._id]);
    }
    return indexed;
}

function getPageData() {
    const sorted = getSortedData();
    const start = (state.currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
}

function getTotalPages() {
    return Math.ceil(IMAGE_DATA.length / ITEMS_PER_PAGE);
}

// ============================================================
//  ギャラリー描画
// ============================================================
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const items = getPageData();

    // フェードアウト → 再描画 → フェードイン
    grid.classList.add('fading');
    setTimeout(() => {
        grid.innerHTML = items.map(item => createItemHTML(item)).join('');
        grid.classList.remove('fading');
        bindItemEvents(grid);
    }, 150);
}

function createItemHTML(item) {
    const id = item._id;
    const liked = state.likedIds.has(id);
    const count = state.likeCounts[id];
    return `
        <div class="gallery-item" data-id="${id}">
            <div class="image-container">
                <img src="${item.src}" alt="${item.alt || ''}" class="gallery-image" loading="lazy">
            </div>
            <div class="image-info">
                <span class="date">${item.date}</span>
                <span class="like-count ${liked ? 'liked-color' : ''}">${count}</span>
            </div>
            <div class="action-buttons">
                <button class="btn btn-like ${liked ? 'liked' : ''}" data-id="${id}" aria-label="いいね">
                    <span class="heart">${liked ? '♥' : '♡'}</span>
                    <span class="like-text">いいね</span>
                </button>
                <button class="btn btn-visit" data-url="${item.twitterUrl}">Xへ移動</button>
            </div>
        </div>
    `;
}

function bindItemEvents(grid) {
    // いいねボタン
    grid.querySelectorAll('.btn-like').forEach(btn => {
        btn.addEventListener('click', handleLike);
    });
    // 訪問ボタン
    grid.querySelectorAll('.btn-visit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.open(e.currentTarget.dataset.url, '_blank');
        });
    });
    // 画像クリック拡大
    grid.querySelectorAll('.gallery-image').forEach(img => {
        img.addEventListener('click', handleImageClick);
    });
}

// ============================================================
//  ページネーション描画
// ============================================================
function renderPagination() {
    const container = document.getElementById('pagination');
    const total = getTotalPages();

    if (total <= 1) {
        container.innerHTML = '';
        return;
    }

    const cur = state.currentPage;
    let html = '';

    // 前へ
    html += `<button class="page-btn prev-btn" ${cur === 1 ? 'disabled' : ''} data-page="${cur - 1}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </button>`;

    // ページ番号（省略付き）
    const pages = buildPageRange(cur, total);
    pages.forEach(p => {
        if (p === '...') {
            html += `<span class="page-ellipsis">…</span>`;
        } else {
            html += `<button class="page-btn num-btn ${p === cur ? 'active' : ''}" data-page="${p}">${p}</button>`;
        }
    });

    // 次へ
    html += `<button class="page-btn next-btn" ${cur === total ? 'disabled' : ''} data-page="${cur + 1}">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </button>`;

    container.innerHTML = html;

    container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            goToPage(parseInt(btn.dataset.page));
        });
    });
}

/** 表示するページ番号の配列を作る（省略あり） */
function buildPageRange(cur, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (cur > 3) pages.push('...');
    for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) {
        pages.push(p);
    }
    if (cur < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

function goToPage(page) {
    state.currentPage = page;
    renderGallery();
    renderPagination();
    // ページ上部へスムーズスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
//  ソート
// ============================================================
function handleSort(e) {
    const type = e.currentTarget.dataset.sort;
    if (state.sortType === type) return;
    state.sortType = type;
    state.currentPage = 1;

    document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');

    renderGallery();
    renderPagination();
}

// ============================================================
//  いいね（改良アニメーション）
// ============================================================
function handleLike(e) {
    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);

    // 二重クリック防止
    if (btn.dataset.animating) return;
    btn.dataset.animating = '1';
    setTimeout(() => delete btn.dataset.animating, 600);

    const isLiked = state.likedIds.has(id);
    const item = btn.closest('.gallery-item');
    const countEl = item.querySelector('.like-count');
    const heart = btn.querySelector('.heart');

    if (isLiked) {
        state.likedIds.delete(id);
        state.likeCounts[id]--;
        btn.classList.remove('liked');
        heart.textContent = '♡';
        countEl.classList.remove('liked-color');
    } else {
        state.likedIds.add(id);
        state.likeCounts[id]++;
        btn.classList.add('liked');
        heart.textContent = '♥';
        countEl.classList.add('liked-color');

        // パーティクルエフェクト
        spawnHeartParticles(btn);
    }

    // カウント更新
    countEl.textContent = state.likeCounts[id];

    // ハートバウンスアニメーション
    heart.classList.remove('heart-bounce');
    void heart.offsetWidth; // reflow
    heart.classList.add('heart-bounce');
}

/** ハートパーティクルを生成 */
function spawnHeartParticles(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
        const p = document.createElement('span');
        p.className = 'heart-particle';
        p.textContent = '♥';

        const angle = (360 / 6) * i;
        const distance = 30 + Math.random() * 20;
        const dx = Math.cos((angle * Math.PI) / 180) * distance;
        const dy = Math.sin((angle * Math.PI) / 180) * distance;

        p.style.cssText = `
            left: ${cx}px;
            top: ${cy}px;
            --dx: ${dx}px;
            --dy: ${dy}px;
            font-size: ${10 + Math.random() * 8}px;
            animation-delay: ${Math.random() * 0.1}s;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

// ============================================================
//  モーダル（画像拡大）
// ============================================================
function handleImageClick(e) {
    const modal = document.getElementById('imageModal');
    modal.querySelector('.modal-image').src = e.target.src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// ============================================================
//  初期化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // ソートボタン
    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.addEventListener('click', handleSort);
    });

    // モーダル閉じる
    document.querySelector('.close').addEventListener('click', closeModal);
    document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // 初期描画
    renderGallery();
    renderPagination();
});
