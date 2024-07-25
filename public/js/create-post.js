
const modal_create_post = document.querySelector(".Modal-CreatePost");
const feel = document.getElementById("feel");
const btn_close = document.querySelector(".close")

feel.addEventListener('click',()=>{
  document.body.classList.add('modal-open')
  modal_create_post.classList.add("show")
})

btn_close.addEventListener("click",()=>{
  document.body.classList.remove('modal-open')
  modal_create_post.classList.remove("show")
})


// var image = document.getElementsByClassName("card-img-top")  // dùng lấy modal bên profile
// for (let i = 0; i < image.length; i++) {
//   image[i].addEventListener('click', function () {
//     modal2[i].style.display = "block";
//     span[i].onclick = function () {
//     modal2[i].style.display = "none";
//     }
//   })
// }


// for (let i = 0; i < slides.length; i++) { // dùng lấy modal bên main
//   slides[i].addEventListener('click', function () {
//     modal2[i].style.display = "block";
//     span1[i].onclick = function () {
//     modal2[i].style.display = "none";
//     }
//   })
// }

// btn.onclick = function () {
//   modal[0].style.display = "block";
// }

// span.onclick = function () {
//   modal[0].style.display = "none";
// }

// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal[0].style.display = "none";
//   }
// }


// function deletePost(post_id) {
//   const form = document.createElement('form');
//   form.method = 'POST';
//   form.action = '/deletepost?post_id=' + post_id;

//   // Tạo trường ẩn CSRF
//   const csrfInput = document.createElement('input');
//   csrfInput.type = 'hidden';
//   csrfInput.name = '_csrf';
//   csrfInput.value = csrfToken;
//   console.log(post_id);
//   console.log(form.action);
//   // Thêm trường ẩn CSRF vào form
//   form.appendChild(csrfInput);

//   // Thêm form vào body và gửi nó
//   document.body.appendChild(form);
//   form.submit();
// }


// document.getElementById('deletePostLink').addEventListener('click', function (event) {
//   event.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
//   document.getElementById('deletePostForm').submit(); // Gửi form
// });
