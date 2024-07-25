const more = document.getElementsByClassName('more')
const modal_post = document.getElementsByClassName('Modal-Post')
const post_cmt = document.getElementsByClassName('post-cmt')
const posts = document.querySelector('.posts')
const post  = document.querySelectorAll('.post')
for (let i = 0; i < more.length; i++) {
    more[i].addEventListener('click', function () {
        document.body.classList.add('modal-open')
        modal_post[i].classList.toggle('show')
    })
    post_cmt[i].addEventListener('click', function () {
        document.body.classList.add('modal-open')
        modal_post[i].classList.toggle('show')
    })
}
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
            posts.removeChild(post[i])
        }
    })
}

// for (let i = 0; i < post.length; i++) {
//     var deletepost = post[i].querySelector('.deletepost')
//     var updatepost = post[i].querySelector('.updatepost')
//     let postid = post[i].querySelector('.post_id').value
    
//     let csrfToken = post[i].querySelector('.csrfToken').value

//     updatepost.addEventListener('click', () => {
//         window.location.href = `/post?post_Id=${postid}&update=true`;
//     });
//     deletepost.addEventListener('click', async function () {
//         alert(i)
//         const formData = {
//             post_id: postid,
//             _csrf: csrfToken
//         }
//         const response = await fetch('/deletepost', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData)
//         })
//         const result = await response.json();
//         if (result.delete == 'yes') { 
//             posts.removeChild(post[i]);
//             i--;

//         }
//     })
// }
post.forEach(post => {
    var deletepost = post.querySelector('.deletepost');
    var updatepost = post.querySelector('.updatepost');
    let postid = post.querySelector('.post_id').value;
    let csrfToken = post.querySelector('.csrfToken').value;

    updatepost.addEventListener('click', () => {
        window.location.href = `/post?post_Id=${postid}&update=true`;
    });

    deletepost.addEventListener('click', async function () {
        alert(postid);
        const formData = {
            post_id: postid,
            _csrf: csrfToken
        };
        const response = await fetch('/deletepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (result.delete == 'yes') {
            posts.removeChild(post);
        }
    });
});