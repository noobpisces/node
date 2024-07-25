
const socket = io();


socket.on('post', (data) => {

    var id1 = 'numlike-' + data._id
    var id2 = 'numlike-modal-' + data._id
    const postElement1 = document.getElementById(id1)
    const postElement2 = document.getElementById(id2)
    if (postElement1) {
        postElement1.textContent = data.likes.length + ' likes -';
    }
    if (postElement2) {
        postElement2.textContent = data.likes.length + ' likes -';
    }

    //alert(postElement2.textContent )
});
socket.on('cmt', (data) => {
    var num = "numcmt-modal-" + data.post_id
    const postElement = document.getElementById(num)
    postElement.textContent = data.num_cmt + ' comments';
    var html = `
    <div class="box-comment">
    <img class="avartar" src="${data.avartar}" alt="User Image">
    <div class="comment-text">
        <span class="username">
            ${data.name}
            <span class="text-muted pull-right">${data.createdAt}</span>
        </span>
        ${data.content}
    </div>

    </div>
`;
    var box_cmts = "box-cmts-" + data.post_id;
    const commentsContainer = document.getElementById(box_cmts);

    // Tạo một đối tượng Element từ chuỗi HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    // Lấy đối tượng con đầu tiên (ví dụ: div.box-comment) từ tempElement
    const commentNode = tempElement.firstElementChild;

    // Kiểm tra commentsContainer có tồn tại và là một Node hợp lệ
    if (commentsContainer instanceof Node) {
        // Thêm commentNode vào đầu commentsContainer
        commentsContainer.insertBefore(commentNode, commentsContainer.firstChild);
    } else {
        console.error('Comments container is not valid or does not exist.');
    }


})

function Register() {
    socket.emit('Register', "Success")
}