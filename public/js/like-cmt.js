

async function likehaha(post_id, like_btn_ID, csrfToken) {
    // Tạo đối tượng chứa dữ liệu cần gửi
    const formData = {
        post_id: post_id,
        _csrf: csrfToken
    };

    try {
        const response = await fetch('/likepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        alert(data.message);

        // Lấy phần tử với ID là like_btn_ID và thay đổi màu nền
        const element = document.getElementById(like_btn_ID);
        if (element) {
            if (data.liked) {
                element.style.backgroundColor = 'blue';
            } else {
                element.style.backgroundColor = '';
            }
        } else {
            console.error("Element with ID", like_btn_ID, "not found!");
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}




async function cmt_post(post_id, id_content, csrfToken) {
    var cmt = document.getElementById(id_content);
    var content = cmt.value;
    document.getElementById(id_content).value = '';

    const formData = {
        post_id: post_id,
        content: content,
        _csrf: csrfToken
    };

    try {
        const response = await fetch('/cmtpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}




// document.addEventListener('DOMContentLoaded', function() {
//     const notificationDropdown = document.querySelector('.notification-dropdown');
//     const notificationBtn = document.querySelector('.notification-btn');

//     notificationBtn.addEventListener('click', function() {
//       notificationDropdown.classList.toggle('show');
//     });

//     // Close the dropdown if the user clicks outside of it
//     window.addEventListener('click', function(event) {
//       if (!notificationDropdown.contains(event.target)) {
//         notificationDropdown.classList.remove('show');
//       }
//     });
//   });


// document.addEventListener('DOMContentLoaded', function () {
//     const notificationDropdown = document.querySelector('.notification-dropdown');
//     const notificationBtn = document.querySelector('.notification-btn');
//     const viewMoreBtn = document.querySelector('.view-more-btn');
//     const notificationItems = document.querySelectorAll('.notification-item');

//     notificationBtn.addEventListener('click', function () {
//         alert("hahah")
//         notificationDropdown.classList.toggle('show');
//         if (notificationDropdown.classList.contains('show')) {
//             showLimitedNotifications();
//         }
//     });

//     // Close the dropdown if the user clicks outside of it
//     window.addEventListener('click', function (event) {
//         if (!notificationDropdown.contains(event.target)) {
//             notificationDropdown.classList.remove('show');
//         }
//     });

//     // Show more notifications when the "View More" button is clicked
//     viewMoreBtn.addEventListener('click', function () {
//         showAllNotifications();
//         viewMoreBtn.style.display = 'none';
//     });

//     function showLimitedNotifications() {
//         notificationItems.forEach((item, index) => {
//             if (index < 7) {
//                 item.style.display = 'block';
//             } else {
//                 item.style.display = 'none';
//             }
//         });
//         if (notificationItems.length > 7) {
//             viewMoreBtn.style.display = 'block';
//         }
//     }

//     function showAllNotifications() {
//         notificationItems.forEach(item => {
//             item.style.display = 'block';
//         });
//     }
// });











// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelectorAll('.like-btn').forEach(function (button) {
//         button.addEventListener('click', function (event) {
//             event.preventDefault();
//             const commentId = this.getAttribute('data-comment-id') || this.getAttribute('data-reply-id');
//             // Thêm mã để xử lý like comment hoặc reply
//             console.log('Liked comment/reply: ' + commentId);
//         });
//     });

//     document.querySelectorAll('.reply-btn').forEach(function (button) {
//         button.addEventListener('click', function (event) {
//             event.preventDefault();
//             const commentId = this.getAttribute('data-comment-id') || this.getAttribute('data-reply-id');
//             // Thêm mã để xử lý reply comment hoặc reply
//             console.log('Replying to comment/reply: ' + commentId);
//         });
//     });
// });
