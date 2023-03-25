const url = "http://localhost:3000";
const form = document.getElementById("form");
const message = document.getElementById("message");
const image =document.getElementById("image");
const token = localStorage.getItem("token");

// send messages
// function setImage(event) {
//   setFile(event.target.files[0])
// }
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // const obj = new FormData(form);
  // // obj.append("message",message.value);
  // // obj.append("files",image.files[0]);
  console.log(image.files[0])

  const obj = {
    message: message.value,
    // image: image.files[0],
  };
  const response = await axios.post(url + "/chat/postmessage", obj, {
    headers: {
       'Authorization': token 
      },
  });
  message.value = "";
  localStorage.removeItem("sendImage");
});

//get all messages
const ul = document.querySelector(".chat-list");
window.addEventListener("DOMContentLoaded", async () => {
  if (!token) {
    alert("Please login first");
    location.replace("./signin.html");
  } else {
    let len = 0;
    let oldMessage = localStorage.getItem("messages");
    let oldMessages = oldMessage ? JSON.parse(oldMessage) : [{}];
    const msg = oldMessages;
    for (let i = len; i < oldMessages.length; i++) {
      if (oldMessages[i].userName !== undefined) {
        const li = document.createElement("li");
        li.className = "li p-3";
        // let picUrl = oldMessages[i].message.split("////////")[1];
        
        // if (picUrl) {
        //     picUrl = picUrl.split("%3A");
        //     let pic = picUrl[0]+":"+picUrl[1]+":"+picUrl[2]+":"+picUrl[3];
        //     let img = document.createElement("img");
        //     img.setAttribute("src",pic);
        //     li.appendChild(document.createTextNode(
        //         oldMessages[i].userName + ":" + " " + img
        //       ))
        // } else {
          li.appendChild(
            document.createTextNode(
              oldMessages[i].userName + ":" + " " + oldMessages[i].message
            )
          );
          ul.appendChild(li);
        // }
      }
    }
    let lastMessage = oldMessages[oldMessages.length - 1];

    // Get All Groups List start
    document.querySelector(".public-chat").addEventListener("click", () => {
      location.replace("./index.html");
    });
    const groups = await axios.get(url + "/group/getallgroups", {
      headers: { Authorization: token },
    });
    const groupList = groups.data.groups;
    for (let i of groupList) {
      const ul = document.querySelector(".group-ul");
      const li = document.createElement("li");
      li.className = "bg-color my-3 p-2";
      li.setAttribute("id", i.groupId);
      li.setAttribute("onClick", "getId(this.id)");
      li.appendChild(document.createTextNode(i.group.groupName));
      ul.appendChild(li);
    }
    // Get All Groups List end
    setInterval(async () => {
      const response = await axios.get(
        url + `/chat/getallchat?lastId=${lastMessage.id}`,
        { headers: { Authorization: token } }
      );
      const chats = response.data.chats;

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
          const li = document.createElement("li");
          li.className = "li p-3";
          li.appendChild(
            document.createTextNode(
              chats[i].userName + ":" + " " + chats[i].message
            )
          );
          ul.appendChild(li);
        }
        localStorage.setItem("messages", JSON.stringify(msg));
      }
      len = length;
    }, 100000);
  }
});
//create group
const createGroup = document.querySelector(".create-group");
createGroup.addEventListener("click", async (e) => {
  document.querySelector(".create-group-container").classList.add("hide");
  document.querySelector(".create-group-form").classList.remove("hide");
});
const gName = document.getElementById("groupname");
const create = document.querySelector(".create");
create.addEventListener("click", async (e) => {
  e.preventDefault();
  const groupName = gName.value;
  if (groupName !== "") {
    const obj = {
      groupName,
    };
    await axios.post(url + "/group/creategroup", obj, {
      headers: { Authorization: token },
    });
    await location.reload();
  } else {
    alert("group name can't be empty");
  }
});

//open group chat
const getId = async (id) => {
  location.replace(`./groupChat.html?${id}`);
};
