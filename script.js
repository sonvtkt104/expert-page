document.addEventListener('DOMContentLoaded', function () {
    try {        
        const track = document.getElementById('journey-track');
        const thumbs = Array.from(document.querySelectorAll('.expert-thumbnail-item'));
        const viewport = track.parentElement;
      
        const sources = thumbs.map(t => t.src);
        let currentIndex = 1;          // bắt đầu ở slide thực đầu tiên (sau clone)
        let slideWidth = 0;
        let timer;
      
        // Dựng slide: clone cuối lên đầu & đầu xuống cuối để loop mượt
        function buildSlides() {
          track.innerHTML = '';
          const extended = [sources[sources.length - 1], ...sources, sources[0]];
          extended.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'expert-slide';
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Journey slide';
            slide.appendChild(img);
            track.appendChild(slide);
          });
        }
      
        function setSizes() {
          slideWidth = viewport.clientWidth;
          // đặt start position tại index 1 (slide thực đầu)
          track.style.transition = 'none';
          track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
          // force reflow để transition lần sau hoạt động
          track.getBoundingClientRect();
          track.style.transition = 'transform .6s ease';
        }
      
        function updateActiveThumb() {
          thumbs.forEach(t => t.classList.remove('active-thumbnail'));
          thumbs[(currentIndex - 1 + sources.length) % sources.length].classList.add('active-thumbnail');
        }
      
        function goTo(index) {
          currentIndex = index;
          track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        }
      
        function next() { goTo(currentIndex + 1); }
      
        // Khi kết thúc transition: nếu đang ở clone thì nhảy về slide thực tương ứng mà không transition
        track.addEventListener('transitionend', () => {
          if (currentIndex === 0) {
            track.style.transition = 'none';
            currentIndex = sources.length;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            track.getBoundingClientRect();
            track.style.transition = 'transform .6s ease';
          } else if (currentIndex === sources.length + 1) {
            track.style.transition = 'none';
            currentIndex = 1;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            track.getBoundingClientRect();
            track.style.transition = 'transform .6s ease';
          }
          updateActiveThumb();
        });
      
        // Auto slide 3s
        function start() { timer = setInterval(next, 3000); }
        function reset() { clearInterval(timer); start(); }
      
        // Click thumbnail để nhảy tới ảnh tương ứng
        thumbs.forEach((t, i) => {
          t.addEventListener('click', () => { goTo(i + 1); reset(); });
        });
      
        // Pause khi hover (tuỳ chọn – có thể bỏ)
        viewport.addEventListener('mouseenter', () => clearInterval(timer));
        viewport.addEventListener('mouseleave', start);
      
        // Init
        buildSlides();
        setSizes();
        updateActiveThumb();
        start();
      
        // Responsive: recalculation khi resize
        window.addEventListener('resize', setSizes);

        function snapToFirst() {
            // Về slide thực đầu tiên (index = 1 vì có clone)
            track.style.transition = 'none';
            currentIndex = 1;
            // Cập nhật kích thước & vị trí (setSizes sẽ set transform đúng cho currentIndex)
            setSizes();
            updateActiveThumb();
            // Force reflow rồi bật lại transition + auto-play
            track.getBoundingClientRect();
            track.style.transition = 'transform .6s ease';
        }

        document.addEventListener('visibilitychange', () => {
            console.log("Visibility changed. Hidden:", document.hidden);
            if (document.hidden) {
                clearInterval(timer);
                return;
            }
            // Tab quay lại: về ảnh đầu tiên rồi chạy lại auto
            snapToFirst();
            start();
        });
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
});
