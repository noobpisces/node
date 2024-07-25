// const post_sliders = document.getElementsByClassName('slides')
const sliders = document.getElementsByClassName('slider');

for (let i = 0; i < sliders.length; i++) {
    const slides = sliders[i].querySelector('.slides');
    const slide = slides.getElementsByClassName('slide');
    const prev_btn = sliders[i].querySelector('.prev');
    const next_btn = sliders[i].querySelector('.next');
    const total_slide = slide.length;
    let index = 0
    next_btn.addEventListener("click", () => {
        index++
        if (index >= total_slide) {
            index = 0
        }
        change_slide(slides, index)
    })
    prev_btn.addEventListener("click", () => {
        index--;
        if (index < 0) {
            index = total_slide - 1; // Quay về slide cuối cùng nếu đã đến đầu
        }
        change_slide(slides, index);
    });
}

function change_slide(slides, index) {
    slides.style.transform = `translateX(-${index * 100}%)`;
}