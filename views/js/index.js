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
            li.className = "li p-3";
            li.appendChild(document.createTextNode(oldMessages[i].userName + ":" + " " + oldMessages[i].message));
            ul.appendChild(li);
        }
    }
    let lastMessage = (oldMessages[oldMessages.length - 1]);
// const groups = await axios.get(`http://localhost:3000/chat/getallgroups`,{
//     headers:{'Authorization':token}
// });
// const groupList = groups.data.groups;
// for(let i of groupList){
//     const ul = document.querySelector('.group-ul');
//     const li = document.createElement("li");
//     li.className="bg-color my-3";
//     const btn = document.createElement('button');
//     btn.className="btn";
//     btn.appendChild(document.createTextNode(i.group.groupName));
//     li.appendChild(btn);
//     ul.appendChild(li);
// }
    setInterval(async () => {
        const response = await axios.get(`http://localhost:3000/chat/getallchat?lastId=${lastMessage.id}`, { headers: { 'Authorization': token } });
        const chats = response.data.chats;
        console.log("ch",chats)
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
                li.className = "li p-3";
                li.appendChild(document.createTextNode(chats[i].userName + ":" + " " + chats[i].message));
                ul.appendChild(li);
            }
            localStorage.setItem("messages", JSON.stringify(msg));
        }
        len = length;
    }, 100000);
})
//create group
const createGroup = document.querySelector(".create-group");
createGroup.addEventListener('click',async(e)=>{
    document.querySelector('.create-group-container').classList.add("hide");
    document.querySelector('.create-group-form').classList.remove('hide');
});
const gName = document.getElementById('groupname');
const create = document.querySelector('.create');
create.addEventListener('click', async(e)=>{
    e.preventDefault()
    const groupName= gName.value;
    if(groupName!==""){
        const obj={
            groupName,
        }
        await axios.post("http://localhost:3000/group/creategroup", obj,{headers:{'Authorization':token}});
        await location.reload();
    }else{
        alert("group name can't be empty");
    }
})