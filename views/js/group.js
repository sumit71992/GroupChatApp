const token = localStorage.getItem("token");
const url = "http://3.109.42.131:4000";

window.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        alert("Please login first");
        location.replace("./signin.html")
    } else {
        let gId = location.search.split("?")[1];
        // Get All Groups List start
        const groups = await axios.get(url+"/group/getallgroups", {
            headers: { 'Authorization': token }
        });
        const groupList = groups.data.groups;
        for (let i of groupList) {
            const ul = document.querySelector('.group-ul');
            const li = document.createElement("li");
            li.className = "bg-color my-3 p-2";
            li.setAttribute("id", i.groupId);
            li.setAttribute("onClick", "getId(this.id)");
            li.appendChild(document.createTextNode(i.group.groupName));
            ul.appendChild(li);
        }
        if (gId) {
            document.getElementById(`${gId}`).click();
        }

        // Get All Groups List end
    }
});

//open group chat and send group message
const sendGroupMsg = async (id) => {
    const msg = document.getElementById('message');
    const obj = {
        message: msg.value,
    }
    await axios.post(url+`/group/postgroupmessage/${id}`, obj, {
        headers: { 'Authorization': token }
    });
    msg.value = ""
}
const getId = async (id) => {
    const groupId = id;
    const sendBtn = document.querySelector('.send');
    const btn = document.createElement('button');
    btn.className = "btn btn-light msg send-btn";
    btn.setAttribute('id', groupId);
    btn.setAttribute('onClick', 'sendGroupMsg(this.id)');
    btn.appendChild(document.createTextNode("Send"));
    document.querySelector('.send-input').classList.remove('hide');
    sendBtn.appendChild(btn);

    const ul = document.querySelector('.chat-list');
    let len = 0;
    let oldMessage = localStorage.getItem(`groupMessages${groupId}`);
    const localStorageGroupName = localStorage.getItem(`groupName${groupId}`);
    if (localStorageGroupName) {
        document.querySelector('h3').innerHTML = localStorageGroupName;
    }
    let oldMessages = oldMessage ? JSON.parse(oldMessage) : [{}];
    const msg = oldMessages;
    for (let i = len; i < oldMessages.length; i++) {
        if (oldMessages[i].user !== undefined) {
            const li = document.createElement('li');
            li.className = "li p-3";
            li.appendChild(document.createTextNode(oldMessages[i].user.name + ":" + " " + oldMessages[i].message));
            ul.appendChild(li);
        }
    }


    setInterval(async () => {
        let lastMessage = (oldMessages[oldMessages.length - 1]);
        const msgs = await axios.get(url+`/group/getgroupmessages/${groupId}?lastId=${lastMessage.id}`, {
            headers: { 'Authorization': token }
        });
        console.log("ch", msgs)

        if (!localStorageGroupName) {
            document.querySelector('h3').innerHTML = msgs.data.groupName.groupName;
            localStorage.setItem(`groupName${groupId}`, msgs.data.groupName.groupName);
        }
        const chats = msgs.data.msg;
        if (chats) {
            const length = chats.length;
            if (len !== length && length > 0) {
                for (let i = len; i < length; i++) {
                    if (msg.length <= 10) {
                        if (chats[i].message !== undefined) {
                            msg.push(chats[i]);
                        }

                    } else if (msg.length > 10) {
                        msg.shift();
                        msg.push(chats[i]);
                    }
                    const li = document.createElement('li');
                    li.className = "li p-3";
                    li.appendChild(document.createTextNode(chats[i].user.name + ":" + " " + chats[i].message));
                    ul.appendChild(li);
                }
                localStorage.setItem(`groupMessages${groupId}`, JSON.stringify(msg));
            }
        }

        len = length;
    }, 1000);

}