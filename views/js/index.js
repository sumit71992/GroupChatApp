const msg = document.querySelector('.msg');
const message = document.getElementById('message');
const token = localStorage.getItem("token");
// send messages
msg.addEventListener("click", async (e) => {
    e.preventDefault();
    const obj = {
        message: message.value
    }
    const response = await axios.post("http://localhost:3000/chat/postmessage", obj, { headers: { 'Authorization': token } });
    message.value = "";
    console.log(response)
})

//get all messages
const ul = document.querySelector('.chat-list');
window.addEventListener("DOMContentLoaded", async () => {
    let len = 0;

    let oldMessage = localStorage.getItem("messages");
    let oldMessages = oldMessage ? JSON.parse(oldMessage) : [{}];
    const msg = oldMessages;
    for (let i = len; i < oldMessages.length; i++) {
        if(oldMessages[i].userName!==undefined){
            const li = document.createElement('li');
            li.className = "p-3";
            li.appendChild(document.createTextNode(oldMessages[i].userName + ":" + " " + oldMessages[i].message));
            ul.appendChild(li);
        }
    }
    let lastMessage = (oldMessages[oldMessages.length - 1]);
    setInterval(async () => {
        const response = await axios.get(`http://localhost:3000/chat/getchat?lastId=${lastMessage.id}`, { headers: { 'Authorization': token } });
        const chats = response.data.chats;
        console.log("chats",chats.length);
        const length = chats.length;
        if (len !== length && length>0) {
            for (let i = len; i < length; i++) {
                if (msg.length <= 10) {
                    if(chats[i].message!==undefined){
                        msg.push(chats[i]);
                    }
                    
                } else if (msg.length > 10) {
                    msg.shift();
                    msg.push(chats[i]);
                }
                const li = document.createElement('li');
                li.className = "p-3";
                li.appendChild(document.createTextNode(chats[i].userName + ":" + " " + chats[i].message));
                ul.appendChild(li);
            }
            localStorage.setItem("messages", JSON.stringify(msg));
        }
        len = length;
    }, 1000);
})

const createGroup = document.querySelector(".create-group");
createGroup.addEventListener('click',async(e)=>{
    document.querySelector('.create-group-container').classList.add("hide");
});
