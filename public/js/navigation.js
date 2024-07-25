const notification_btn = document.querySelector(".notification-btn");
const notification_content = document.querySelector(".notification-content");
const view_more_button = document.querySelector(".view-more-btn");
const notification_items = document.querySelectorAll(".notification-item")
const message_btn = document.querySelector('.message-btn')
const message_content = document.querySelector('.message_content')
message_btn.addEventListener('click', () => {
    message_content.classList.toggle('show')
})

notification_btn.addEventListener("click", () => {
    notification_content.classList.toggle('show');

});




notification_items.forEach((item, index) => {
    if (index > 7) {
        item.style.display = "none";
    }
})
if (view_more_button) {
    view_more_button.addEventListener("click", () => {
        notification_items.forEach(item => {
            item.style.display = "block";
        });
        view_more_button.style.display = "none";
    })
}
socket.on('follow', (data) => {
    const new_div = document.createElement('div');
    new_div.classList.add('notification-item');

    const new_a = document.createElement('a');

    new_a.href = `profile?username=${data.name}`;

    new_a.innerHTML = `${data.name} - ${new Date(data.date).toLocaleString('en-US', { timeZone: 'UTC' })}`;
    new_div.appendChild(new_a);

    // Thêm phần tử thông báo mới vào danh sách thông báo
    const notificationContainer = document.querySelector('.notification-items'); // Cần đảm bảo rằng bạn có phần tử chứa thông báo với id này trong HTML
    notificationContainer.appendChild(new_div);
})


const search_btn = document.querySelector('.btn-outline-success')
const search_input = document.getElementById('searchInput')
const list_users = document.querySelector('.list_user')
search_btn.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
        const search_input_value = search_input.value
        const response = await fetch(`/search?info=${search_input_value}`);
        const users = await response.json();
        updateUserList(users);
        list_users.classList.add('show')

    } catch (error) {
        console.error('Error fetching search results:', error);
    }

})
function updateUserList(users) {

    // Clear previous results
    list_users.innerHTML = '';

    users.forEach(user => {
        const userLink = document.createElement('a');
        userLink.className = 'user_link';
        userLink.href = `/profile?username=${user.name}`;

        const userImage = document.createElement('img');
        userImage.src = user.profilePicture || 'defaultImagePath'; // Default image path if profilePicture is null
        userImage.alt = '';
        userImage.className = 'avartar';

        const userName = document.createElement('span');
        userName.className = 'name';
        userName.textContent = user.name;
        userLink.style
        userLink.appendChild(userImage);
        userLink.appendChild(userName);
        list_users.appendChild(userLink);
    });
}
