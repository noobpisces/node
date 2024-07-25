const dropdown_btn = document.querySelector('.drop-down-btn');
const dropdown_menu = document.querySelector('.dropdown-menu');

if (dropdown_btn) {
    dropdown_btn.addEventListener('click', () => {
        dropdown_menu.classList.toggle('show')
    })
}
const img_first = document.getElementsByClassName('img-first')
const modal_post = document.getElementsByClassName('Modal-Post')
for (let i = 0; i < img_first.length; i++) {
    img_first[i].addEventListener('click', () => {
        modal_post[i].classList.add('show')
        document.body.classList.remove('modal-open')
    })
}


const row = document.querySelector('.row')
const first_picture = document.getElementsByClassName('first-picture')
for (let i = 0; i < modal_post.length; i++) {
    var deletepost = modal_post[i].querySelector('.deletepost-modal')
    let postid = modal_post[i].querySelector('.post_id').value
    let csrfToken = modal_post[i].querySelector('.csrfToken').value
    deletepost.addEventListener('click', async function () {
        alert(postid)
        const formData = {
            post_id: postid,
            _csrf: csrfToken
        }
        const response = await fetch('/deletepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const result = await response.json();
        if (result.delete == 'yes') {
            modal_post[i].classList.remove('show')
            document.body.classList.remove('modal-open')
            row.removeChild(first_picture[i])
        }
    })
}
