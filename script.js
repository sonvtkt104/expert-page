document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('main-journey-image');
    const thumbnails = document.querySelectorAll('.expert-thumbnail-item');
    let currentIndex = 0;
    let intervalId;

    // Hàm để cập nhật ảnh chính và thumbnail active
    function updateImage(index) {
        // Cập nhật ảnh chính
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = thumbnails[index].src;
            mainImage.style.opacity = '1';
        }, 300); // Đợi hiệu ứng mờ kết thúc rồi mới đổi ảnh

        // Cập nhật trạng thái active cho thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active-thumbnail'));
        thumbnails[index].classList.add('active-thumbnail');
        currentIndex = index;
    }

    // Xử lý khi click vào thumbnail
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateImage(index);
            // Reset lại bộ đếm thời gian tự động chuyển
            resetInterval();
        });
    });

    // Hàm tự động chuyển ảnh
    function startInterval() {
        intervalId = setInterval(() => {
            let nextIndex = (currentIndex + 1) % thumbnails.length;
            updateImage(nextIndex);
        }, 3000); // 3000ms = 3 giây
    }

    // Hàm reset bộ đếm
    function resetInterval() {
        clearInterval(intervalId);
        startInterval();
    }

    // Bắt đầu tự động chuyển ảnh khi tải trang
    startInterval();
});