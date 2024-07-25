const imgPostContainer = document.querySelector('.imgs');
const imgInput = document.getElementById('image');
let filesArray = [];
let deleteFilesArray = []
imgInput.addEventListener('change', function (event) {
    const files = Array.from(event.target.files);
    filesArray = [];
    filesArray = filesArray.concat(files);

    files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('media-item2');

            const newImg = document.createElement('img');
            newImg.src = e.target.result;
            newImg.classList.add('img_post');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete_media_item');
            deleteButton.textContent = 'xóa ảnh';

            deleteButton.addEventListener('click', () => {
                imgPostContainer.removeChild(newDiv);
                filesArray.splice(index, 1);
                console.log('Updated filesArray:', filesArray);  // Debugging line
            });

            newDiv.appendChild(newImg);
            newDiv.appendChild(deleteButton);
            imgPostContainer.appendChild(newDiv);
        }

        reader.readAsDataURL(file);
    });
});

const media_item1s = document.querySelectorAll('.media-item1');
media_item1s.forEach((media_item1)=>{
  deleteFilesArray = []
    const delete_media_item = media_item1.querySelector('.delete_media_item')
    delete_media_item.addEventListener('click', () => {
        const url = media_item1.querySelector('.img_post').src;
        const relativePath = url.split('/images/')[1];
        const finalPath = 'images/' + relativePath;
        deleteFilesArray.push(finalPath)
        imgPostContainer.removeChild(media_item1)
        for(let i = 0;i<deleteFilesArray.length;i++){
          console.log(deleteFilesArray[i])}

    })
})
// for (let i = 0; i < media_item1.length; i++) {
//     deleteFilesArray = []
//     const delete_media_item = media_item1[i].querySelector('.delete_media_item')
//     delete_media_item.addEventListener('click', () => {
//         const url = media_item1[i].querySelector('.img_post').src;
//         const relativePath = url.split('/images/')[1];
//         const finalPath = 'images/' + relativePath;
//         deleteFilesArray.push(finalPath)
//         imgPostContainer.removeChild(media_item1[i])

//     })
// }




async function updatePost() {
    const formData = new FormData();
    const content = document.querySelector('#content').value;
    const location = document.querySelector('#location').value;
    const visibility = document.querySelector('#visibility').value;
    const csrf = document.querySelector('#csrf').value;
    const postid = document.querySelector('#postid').value;
  
    formData.append('content', content);
    formData.append('location', location);
    formData.append('visibility', visibility);
    formData.append('_csrf', csrf);
  
    filesArray.forEach((file) => {
      formData.append('Picture_Video', file);
    });
  
    // deleteFilesArray.forEach((file) => {
    //   formData.append('deleteFilesArray', file);
    // });
    formData.append('deleteFilesArray', JSON.stringify(deleteFilesArray));
  
    try {
      const response = await fetch(`/post?post_Id=${postid}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        window.location.href = `/post?post_Id=${postid}`;
      } else {
        console.error('Update failed:', await response.json());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
const updateButton = document.getElementById('updateButton');
updateButton.addEventListener('click', async function (event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Gọi hàm updatePost để xử lý cập nhật bài viết
    updatePost();
});