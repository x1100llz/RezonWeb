// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// ========== 事件监听初始化 ==========
function initializeEventListeners() {
    // 排序按钮
    const sortButtons = document.querySelectorAll('.btn-sort');
    sortButtons.forEach(button => {
        button.addEventListener('click', handleSort);
    });

    // いいね按钮
    const likeButtons = document.querySelectorAll('.btn-like');
    likeButtons.forEach(button => {
        button.addEventListener('click', handleLike);
    });

    // 访问按钮
    const visitButtons = document.querySelectorAll('.btn-visit');
    visitButtons.forEach(button => {
        button.addEventListener('click', handleVisit);
    });

    // 图片点击放大
    const images = document.querySelectorAll('.gallery-image');
    images.forEach(image => {
        image.addEventListener('click', handleImageClick);
    });

    // 模态框关闭
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // 键盘ESC关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// ========== 排序功能 ==========
function handleSort(event) {
    const sortType = event.target.dataset.sort;
    const galleryGrid = document.querySelector('.gallery-grid');
    const items = Array.from(document.querySelectorAll('.gallery-item'));

    // 更新按钮的活动状态
    document.querySelectorAll('.btn-sort').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // 排序逻辑
    if (sortType === 'date') {
        items.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return dateB - dateA; // 最新的在前
        });
    } else if (sortType === 'likes') {
        items.sort((a, b) => {
            const likesA = parseInt(b.dataset.likes);
            const likesB = parseInt(a.dataset.likes);
            return likesA - likesB; // いいね多的在前
        });
    }

    // 重新排列DOM元素
    items.forEach(item => {
        galleryGrid.appendChild(item);
    });
}

// ========== いいね功能 ==========
function handleLike(event) {
    event.preventDefault();
    
    const btn = event.currentTarget;
    const galleryItem = btn.closest('.gallery-item');
    const likeCountElement = galleryItem.querySelector('.like-count');
    const heart = btn.querySelector('.heart');
    let currentLikes = parseInt(galleryItem.dataset.likes);

    // 切换いいね状态
    if (btn.classList.contains('liked')) {
        btn.classList.remove('liked');
        heart.textContent = '♡'; // 空心爱心
        currentLikes--;
    } else {
        btn.classList.add('liked');
        heart.textContent = '♥'; // 实心爱心
        currentLikes++;
    }

    // 更新いいね数
    galleryItem.dataset.likes = currentLikes;
    likeCountElement.textContent = currentLikes;

    // いいね动画效果
    heart.style.animation = 'none';
    setTimeout(() => {
        heart.style.animation = 'likeAnimation 0.6s ease';
    }, 10);
}

// いいね动画关键帧
const style = document.createElement('style');
style.textContent = `
    @keyframes likeAnimation {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// ========== 访问功能 ==========
function handleVisit(event) {
    event.preventDefault();
    
    // 推特链接 - 你可以根据需要修改为实际的推特用户或帖子URL
    const twitterUrl = 'https://twitter.com';
    window.open(twitterUrl, '_blank');
}

// ========== 图片放大功能 ==========
function handleImageClick(event) {
    const imageSrc = event.target.src;
    const modal = document.getElementById('imageModal');
    const modalImage = document.querySelector('.modal-image');

    modalImage.src = imageSrc;
    modal.classList.add('show');

    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
}

// ========== 关闭模态框 ==========
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// ========== 工具函数：获取排序类型 ==========
function getCurrentSortType() {
    const activeButton = document.querySelector('.btn-sort.active');
    return activeButton ? activeButton.dataset.sort : null;
}

// ========== 窗口大小变化时的处理 ==========
window.addEventListener('resize', function() {
    // 可以在这里添加响应式布局的额外处理
    // 目前CSS媒体查询已经处理了大部分响应式需求
});
