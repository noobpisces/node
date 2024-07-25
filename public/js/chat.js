const chat_content = document.getElementsByClassName('chat_content')

const send_message = document.getElementsByClassName('send_message')
const chat_box = document.getElementsByClassName('chat-box')

const dic_for_profile = {}
const close_chat = document.getElementsByClassName('close-chat')

for (let i = 0; i < chat_box.length; i++) {
    chat_box[i].style.right = `${i * 410}px`;
    chat_box[i].style.bottom = '10px';
}

const chat_btn = document.querySelector('.chat_btn')
const message_item = document.getElementsByClassName('message-item') //cáo mày là trên thông báo, chatboxx[cía này] là chatboxx cuối của profile

const profile = document.querySelector('.profile')
for (let i = 0; i < message_item.length; i++) {
    const user_id = chat_box[i].querySelector('.user_id').value
    const user_query_id = chat_box[i].querySelector('.user_query_id').value
    const csrfToken = chat_box[i].querySelector('.csrfToken').value
    const chat_id = chat_box[i].querySelector('.chat_id').value
    dic_for_profile[chat_id] = i
    message_item[i].addEventListener('click', function () {
        chat_box[i].classList.toggle('show')
        scrolldown(i)
        getChat(user_id, user_query_id, i, true)
    })
    send_message[i].addEventListener('click', () => {
        postChat(user_id, user_query_id, csrfToken, i, chat_id, true)
    })
    close_chat[i].addEventListener('click',()=>{
        unGetChat(user_id,i)
    })

}
if (profile) {
    if (chat_box[message_item.length]) { // chưa chat lần nào thì sẽ có 1 chatbox rỗng, chat rồi thì chỉ cần id chủa chat sau đó lấy chatbox tương ứng trên navigation
        const user_id = chat_box[message_item.length].querySelector('.user_id').value
        const user_query_id = chat_box[message_item.length].querySelector('.user_query_id').value
        const csrfToken = chat_box[message_item.length].querySelector('.csrfToken').value
        send_message[message_item.length].addEventListener('click', () => {
            postChat(user_id, user_query_id, csrfToken, message_item.length, 'chưa chat', false)
        })
        if (chat_btn) {
            chat_btn.addEventListener("click", () => {
                let chat_box = profile.querySelector('.chat-box')
                chat_box.classList.add('show')
                let chat_content = chat_box.querySelector('.chat_content')
                //scrolldown()
                chat_content.scrollTop = chat_content.scrollHeight
                const observer = new MutationObserver(() => {
                    chat_content.scrollTop = chat_content.scrollHeight
                });
                observer.observe(chat_content, { childList: true });
                getChat(user_id, user_query_id, message_item.length, false)
            })
        }
    } else {
        console.log("có chat nè haha")
        if (chat_btn) {
            const chat_id = profile.querySelector('.chat_id').value
            if (!(chat_id in dic_for_profile)) {
                console.error(`Chat ID ${chat_id} không tồn tại trong dic_for_profile.`);
            }

            let i = dic_for_profile[chat_id];
            console.log(i);
            const user_id = chat_box[i].querySelector('.user_id').value
            const user_query_id = chat_box[i].querySelector('.user_query_id').value
            const csrfToken = chat_box[i].querySelector('.csrfToken').value
            dic_for_profile[chat_id] = i
            chat_btn.addEventListener('click', function () {
                chat_box[i].classList.toggle('show')
                scrolldown(i)
                getChat(user_id, user_query_id, i, true)
            })
            // send_message[i].addEventListener('click', () => {
            //     postChat(user_id, user_query_id, csrfToken, i, chat_id, true)
            // })
        }

    }

}


function scrolldown(i) {
    chat_content[i].scrollTop = chat_content[i].scrollHeight
    const observer = new MutationObserver(() => {
        chat_content[i].scrollTop = chat_content[i].scrollHeight
    });
    observer.observe(chat_content[i], { childList: true });
}



function unGetChat(user_id,i) {
    socket.emit('ungetchat', user_id)
    chat_box[i].classList.remove('show')
}
function getChat(user_id, user_query_id, i, check) {//xem xét lại thử check có cần không

    const fetchChat = async () => {
        chat_content[i].innerHTML = ''
        const response = await fetch(`/chat?toUser=${user_query_id}`)
        const chat = await response.json();


        var messageContent = ''
        if (chat.chat == 'yes') {
            for (let j = 0; j < chat.data.contents.length; j++) {
                const profilePicture = chat.data.contents[j].author.profilePicture
                    ? chat.data.contents[j].author.profilePicture
                    : 'images/avatar/66797a8c9bb5d0b914b421b9-1719802717362-433928235PEhn8kSfHBhHASxgQSidcn-1200-80.jpg';

                const chat_div = document.createElement('div')
                if (chat.data.contents[j].author._id == user_id) {
                    chat_div.className = 'chat_user'
                    messageContent = `
                <span class="message">
                    ${chat.data.contents[j].content}
                </span>
                <img src="${profilePicture}" alt="" class="avartar">`;
                } else {
                    chat_div.className = 'chat_user_query'
                    messageContent = `
                    <img src="${profilePicture}" alt="" class="avartar">
                    <span class="message">
                        ${chat.data.contents[j].content}
                    </span>`;
                }
                chat_div.innerHTML = messageContent;
                chat_content[i].appendChild(chat_div)
            }
        } else {
            console.log('thấy chưa  eee')
            chat_content[i].innerHTML = 'haha';
        }
        if (check) {
            socket.emit('getchat', chat.data._id)
        } else {
            socket.emit('getchat2', user_id)
        }
    }
    fetchChat();
}


async function postChat(user, user_query, csrfToken, i, chat_id, check) {
    const chat_message = chat_box[i].querySelector('.chat_message')
    const formData = {
        content: chat_message.value,
        _csrf: csrfToken
    };
    const response = await fetch(`/chat?toUser=${user_query}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    const chat = await response.json();
    if (check) {
        socket.emit("newchat", {
            content: chat_message.value,
            to: chat_id,
            from: user
        });
    } else {
        socket.emit("newchat2", {
            content: chat_message.value,
            to: user_query,
            from: user
        });
    }

    const chat_div = document.createElement('div')
    chat_div.className = 'chat_user'
    const messageContent = `
                <span class="message">
                    ${chat_message.value}
                </span>
                <img src="${chat.chat.author.profilePicture}" alt="" class="avartar">`;
    chat_div.innerHTML = messageContent;
    chat_message.value = ''
    chat_content[i].appendChild(chat_div)


}

socket.on('newchat', (data) => {
    const chat_box = document.getElementById(data.room)
    const chat_content_id = chat_box.querySelector('.chat_content')
    const picture = `${data.from} ? ${data.from} : 'images/avatar/66797a8c9bb5d0b914b421b9-1719802717362-433928235PEhn8kSfHBhHASxgQSidcn-1200-80.jpg'`
    const chat_div = document.createElement('div')
    chat_div.className = 'chat_user_query'
    messageContent = `
                    <img src="${picture} " alt="" class="avartar">
                    <span class="message">
                        ${data.content}
                    </span>`;

    chat_div.innerHTML = messageContent;
    chat_content_id.appendChild(chat_div)
})


socket.on('newchat2', (data) => {  //socket cho profile, chưa chat lần nào
    const chat_content = chat_box[message_item.length].querySelector('.chat_content')
    const picture = `${data.from} ? ${data.from} : 'images/avatar/66797a8c9bb5d0b914b421b9-1719802717362-433928235PEhn8kSfHBhHASxgQSidcn-1200-80.jpg'`
    const chat_div = document.createElement('div')
    chat_div.className = 'chat_user_query'
    messageContent = `
                    <img src="${picture} " alt="" class="avartar">
                    <span class="message">
                        ${data.content}
                    </span>`;

    chat_div.innerHTML = messageContent;
    chat_content.appendChild(chat_div)
})