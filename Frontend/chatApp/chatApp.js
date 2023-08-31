let createGroup = document.getElementById('createGroup')
const groupIds=[]



document.addEventListener('DOMContentLoaded', async()=>{
    try{
        const token = localStorage.getItem('token')                                                         
        const fileInput=document.getElementById('fileInput');
        console.log('10---------------', fileInput)
        const uploadButton=document.getElementById('uploadFile')
       
        uploadButton.addEventListener('click', async()=>{
        const file=fileInput.files[0]
        if(!file){
           alert('Please select a file') 
           return;
        }
        const formData=new FormData();
        formData.append('file', file)

        console.log("18888888888888888", formData)

        const response=await axios.post('http://localhost:5100/multimediaFile/create-multimediaFile', formData, {
            headers:{"Authorization":token}
        });
        response.status(200).json({File})
     })
    }catch(error){
        console.log(error)
    }
})



document.getElementById('downloadFile').addEventListener('click', download);
async function download() {
    try {
      const token=localStorage.getItem('token')
      const response = await axios.get('http://localhost:5100/multimediaFile/get-multimediaFile', {
        headers: { "Authorization": token }
      });
        console.log('3393393339333339', response)
      if (response.status === 200) {
        const downloadUrl = response.data.fileUrl;
        console.log('730_______________--------------', downloadUrl)
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'my.csv';
        downloadLink.click();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

async function groupChat(message, id, group){
    event.preventDefault();
    try {
        const token = localStorage.getItem('token')
        const decodeToken = parseJwt(token);
        const name = decodeToken.name;
        console.log('7777777777', name, id)
        const obj = {
            name,
            message,
            id
        }
        console.log({obj})
        const response = await axios.post("http://localhost:5100/chat/add-chat", obj, { headers: { "Authorization": token } })
        console.log('17*************', response)
        showChatOnGroup(response.data.chat, id, group)
        

    } catch (error) {
        console.error(error)
    }
}

async function formSubmit(event) {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token')
        const decodeToken = parseJwt(token);
        const name = decodeToken.name;
        // console.log('7777777777', name)
        const message = event.target.message.value;

        const obj = {
            name,
            message
        }
        //console.log('1555________________', obj)
        document.forms[0].reset();

        const response = await axios.post("http://localhost:5100/chat/add-chat", obj, { headers: { "Authorization": token } })
        console.log('17------------', response)
        showChatOnScreen(response.data.chat)
        await fetchMessages();


    } catch (error) {
        console.log(error)
    }
}

function getQueryParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// let selectedGroupData = null;


window.addEventListener("DOMContentLoaded", async () => {
    try {
// Get the passed serialized array
    const serializedArray = getQueryParam("groupIds");
// Deserialize the array (using JSON.parse)
    const groupsJoined = JSON.parse(decodeURIComponent(serializedArray));
// Now you can use the array in your chat application logic
    console.log('***** value aaya ki nhi ? *********',groupsJoined);

        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:5100/chat/get-chat`, { headers: { "Authorization": token } })
        console.log('33------- chtas******', response)//you have to get only last data of response but u r getting all chats in response
        let obj ={}
        console.log('response.data.allChats.', response.data.allChats)
        // store chats groupwise in local storage
        let chats = response.data.allChats
        for(let gid=0 ; gid < chats.length; gid++){
            const groupId = chats[gid].groupId == null ? 0: chats[gid].groupId
            console.log('-----------++++++',chats[gid], groupId)
            if(obj[groupId]){
                // obj[groupId].push(chats[gid].message)
                obj[groupId].push(chats[gid])
            }else{
                let arr=[]
                arr.push(chats[gid])
                obj[groupId] = arr
            }
        }

        Object.entries(obj).forEach(([key, value]) => {
            localStorage.setItem(`chats-${key}`, JSON.stringify(value));
            console.log(`Kha pr aaya h bro--${key} ${value}`);
          })
        console.log('*********msg obj*********', obj)
        


        getResponseFromLS()
        if(groupsJoined!= null){
            groupsJoined.forEach((id)=>{
                getResponseFromLS2(id)
            })
        }
        // showChatOnScreen(response.data.allChats[response.data.allChats.length - 1])
        const response2 = await axios.get("http://localhost:5100/get/get-group", { headers: { "Authorization": token } });
        console.log('All group response2:', response2);
        const allGroups = response2.data.allGroups;
        allGroups.forEach(group => {
            const completedListElem = document.getElementById('createdGroup');
            const completedItemElem = document.createElement('li');
            const groupName = group.groupName;
            const selectedMembers = JSON.parse(group.selectedMembers);
            console.log('---------------------', group.id)
            completedItemElem.id = group.id
            groupIds.push(group.id)
            completedItemElem.textContent = `Group Name: ${groupName} --> Member ids: ${selectedMembers}`
            completedListElem.appendChild(completedItemElem);

            const chatButton = document.createElement('input')
            chatButton.type = "button"
            chatButton.style.backgroundColor = 'red';
            chatButton.style.color = 'white';
            chatButton.value = "Chat"
            chatButton.onclick = () => {
              chat(group.id, groupName)
              // chatHandle()
            }

            const joinGroupButton = document.createElement('input');
            joinGroupButton.type = "button";
            joinGroupButton.style.backgroundColor = 'green';
            joinGroupButton.style.color = 'white';
            joinGroupButton.value = "Join Group";
            joinGroupButton.onclick = () => {
                // deleteGroup(group.id);
                completedListElem.removeChild(completedItemElem);

                openCreateGroupForm()
            }
            completedItemElem.appendChild(joinGroupButton);
            completedItemElem.appendChild(chatButton)

            completedListElem.appendChild(completedItemElem);
        })
        groupIds.forEach((id)=>{
            getResponseFromLS2(id)
        })



        createGroup.onclick = openCreateGroupForm;

    } catch (error) {
        console.log(error)
    }
})

async function deleteGroup(id) {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5100/group/delete-group/${id}`, { headers: { "Authorization": token } })
}

async function deleteChat(id) {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5100/chat/delete-chat/${id}`, { headers: { "Authorization": token } })
}

async function getGroup(id) {
    const token = localStorage.getItem('token')
    const groupData = await axios.get(`http://localhost:5100/group/get-group/${id}`, { headers: { "Authorization": token } })
    console.log('******gandu data****', groupData)
    return groupData.data.group
}

// Assuming you have a button with id 'createGroup'

console.log('-----------------')
function chat(id, group){
    const chatContent =`
    <div class="send">
    <form onsubmit="chatHandle()" id="send-msg-${id}">
        <input type="hidden" name="name" id="name">
        <input type="text" name="message" id="chatmsg-${id}">
        <button type="submit">send msg in ${group}</button> 
    </form>
    </div>
    `
    const chatt = document.createElement('div');
    chatt.classList.add('chatt');
    chatt.innerHTML = chatContent;

    document.body.appendChild(chatt);
    


    const chatW = document.getElementById(`send-msg-${id}`);
    chatW.onsubmit = async function handleFormSubmit(event) {
        event.preventDefault();
        const msg = document.getElementById(`chatmsg-${id}`).value;
        console.log('bhains***********', msg)
        groupChat(msg, id, group)
        document.getElementById(`chatmsg-${id}`).value=''
    }
}

// function chatHandle(){
//     const chatW = document.getElementById('send-msg');
//     chatW.onsubmit = async function handleFormSubmit(event) {
//         event.preventDefault();
//         const msg = document.getElementById('chatmsg').value;
//         console.log('bhains***********', msg)
//     }
// }

// function () {
    // Create a modal or form element dynamically
     // Create form content
//      const formContent = `
//      <form id="groupForm">
//          <label for="groupName">Group Name:</label>
//          <input type="text" id="groupName" name="groupName" required>
//          <br>
//          <label for="groupMembers">Select Members:</label>
//          <div id="groupMembers" class="member-list">
//              <!-- Here, you can dynamically generate checkbox inputs for group members -->
//          </div>
//          <button type="submit">Create Group</button>
//      </form>
//  `;
    // const modal = document.createElement('div');
    // modal.classList.add('modal');
    // modal.innerHTML = formContent;
    // document.body.appendChild(modal);

    
    // Fetch the list of users and populate the member list dynamically
    // fetchUsersAndPopulateMemberList();
    // Handle form submission
    // const groupForm = document.getElementById('groupForm');
    // groupForm.onsubmit = async function handleFormSubmit(event) {
    //     event.preventDefault();
    //   const groupName = document.getElementById('groupName').value;
    //     console.log('88888', groupName)
    //     const selectedMembers = Array.from(document.querySelectorAll('.member-checkbox:checked')).map(checkbox => checkbox.value);
        
       
    //     console.log('9000000', selectedMembers)
    //     // Example array data

    //     const token = localStorage.getItem('token')
    //     const decodeToken = parseJwt(token);
    //     const userId = decodeToken.userId;
    //     const data = {
    //         userId: userId,
    //         groupName: groupName,
    //         selectedMembers: selectedMembers
    //     }
    //     console.log('999999++++++++', data)
    //     try {
    //         const token = localStorage.getItem('token');

    //         const response = await axios.post("http://localhost:5100/create/create-group", data, {
    //             headers: {
    //                 "Authorization": token
    //             }
    //         });
    //         console.log('136666666666666', response)
    //         localStorage.setItem('createdGroups', JSON.stringify(response.data));
    //         // Close the modal after group creation
    //         modal.remove();
    //         const completedListElem = document.getElementById('createdGroup');
    //         const completedItemElem = document.createElement('li');
    //         completedItemElem.id = response.data.groupData.id
    //         console.log('id groip******** completedItemElem.id',  completedItemElem.id)
    //         completedItemElem.textContent = `Group Name: ${response.data.groupData.groupName} -->Member ids: ${response.data.groupData.selectedMembers.join(', ')}`;
    //         completedListElem.appendChild(completedItemElem);

    //         const chatButton = document.createElement('input')
    //         chatButton.type = "button"
    //         chatButton.style.backgroundColor = 'red';
    //         chatButton.style.color = 'white';
    //         chatButton.value = "Chat"
    //         chatButton.onclick = () => {
    //           chat(response.data.groupData.id, response.data.groupData.groupName)
    //         }

    //         const joinGroupButton = document.createElement('input')
    //         joinGroupButton.type = "button"
    //         joinGroupButton.style.backgroundColor = 'green';
    //         joinGroupButton.style.color = 'white';
    //         joinGroupButton.value = "Join Group"
    //         joinGroupButton.onclick = () => {
    //             // completedListElem.removeChild(completedItemElem)
    //             openCreateGroupForm()
    //         }
    //         completedItemElem.appendChild(joinGroupButton)
    //         completedItemElem.appendChild(chatButton)

    //         completedListElem.appendChild(completedItemElem)
    //     } catch (error) {
    //         console.log('Error creating group:', error);
    //     }
    // };
// };

// async function fetchUsersAndPopulateMemberList() {
//     try {
//         const token = localStorage.getItem('token');
//         const usersResponse = await axios.get("http://localhost:5100/user/group-user", {
//             headers: {
//                 "Authorization": token
//             }
//         });
//         console.log('119----------------->', usersResponse)


//         const groupMembersDiv = document.getElementById('groupMembers');
//         groupMembersDiv.innerHTML = usersResponse.data.allUsers.map(user => `
//             <label>
//                 <input type="checkbox" class="member-checkbox" name="groupMembers" value="${user.id}">
//                 ${user.name}
//                 <br>
//             </label>
//         `).join('')
//     } catch (error) {
//         console.log('Error fetching users:', error);
//     }
// }

async function getResponseFromLS2(id) {

    const savedResponse = localStorage.getItem(`chats-${id}`)
    // console.log('57777', savedResponse)
    if (savedResponse) {
        const parsedResponse = JSON.parse(savedResponse)
        // console.log('60', parsedResponse)
        const chatsArray = parsedResponse
        console.log('3333333333338888-----------',chatsArray)
        const groupData = await getGroup(id)
        console.log('*******Sorry sir*********', groupData, groupData.groupName)
        for (let i = 0; i < chatsArray.length - 1; i++) {
            showChatOnGroup(chatsArray[i], id, groupData.groupName)
        }

    } else {
        console.log('No saved response in localStorage')
    }
}
async function getResponseFromLS() {
    const savedResponse = localStorage.getItem('chats-0')
    // console.log('57777', savedResponse)
    if (savedResponse) {
        const parsedResponse = JSON.parse(savedResponse)
         console.log('60', parsedResponse)
        const chatsArray = parsedResponse
        console.log('845125',chatsArray)
        for (var i = 0; i < chatsArray.length; i++) {
            showChatOnScreen(chatsArray[i])
        }

    } else {
        console.log('No saved response in localStorage')
    }
}

// fetch message to show chats on container-0
async function fetchMessages(){
    try{
     const token=localStorage.getItem('token')
     const response=await axios.get('http://localhost:5100/chat/get-chat', {headers:{"Authorization":token}});
     console.log(response)
     var Data=response.data.allChats;
     const parentElem=document.getElementById('message-container');
     parentElem.innerHTML=''
     Data.forEach(message=>{
      const childElem=document.createElement('div')
      childElem.textContent=message.name+ ' : '+ message.message;
      childElem.style.color = "black"; // Change the text color to blue
      childElem.style.fontSize = "25px"; // Change the font size to 16 pixels
      childElem.style.fontStyle = "bold"; // Apply italic style
      parentElem.appendChild(childElem)
     })
     }catch(error){
        console.log(error)
    }
}
// setInterval(fetchMessages, 5000)
function createContainer(id, group){
    const cont = document.createElement('div');
    cont.className='container'
    cont.id = `message-${id}`
    cont.innerHTML=`<legend>Group Name : ${group}</legend>`
    const parentElem = document.getElementById('message-container');
    parentElem.appendChild(cont)
    return cont
}

function showChatOnGroup(obj, id, group){
    let parentElem = document.getElementById(`message-${id}`);
    console.log('parentElem parentElem', parentElem, )
    if(parentElem == null){ 
        parentElem = createContainer(id, group)
    }
    const childElem = document.createElement('div')
    childElem.textContent = obj.name + ' : ' + obj.message;
    childElem.style.color = "blue"; // Change the text color to blue
    childElem.style.fontSize = "25px"; // Change the font size to 16 pixels
    childElem.style.fontStyle = "bold"; // Apply italic style

    const deleteButton = document.createElement('input')
    deleteButton.type = "button"
    deleteButton.style.backgroundColor = 'brown';
    deleteButton.style.color = 'white';
    deleteButton.value = "Delete"

    deleteButton.onclick = () => {
        deleteChat(obj.id)
        parentElem.removeChild(childElem)
    }
    childElem.appendChild(deleteButton)
    parentElem.appendChild(childElem)
}

function showChatOnScreen(obj) {
    const parentElem = document.getElementById('message-container');
    const childElem = document.createElement('div')
    childElem.textContent = obj.name + ' : ' + obj.message;
    childElem.style.color = "black"; // Change the text color to blue
    childElem.style.fontSize = "25px"; // Change the font size to 16 pixels
    childElem.style.fontStyle = "bold"; // Apply italic style
    parentElem.appendChild(childElem)

    const deleteButton = document.createElement('input')
    deleteButton.type = "button"
    deleteButton.style.backgroundColor = 'red';
    deleteButton.style.color = 'white';
    deleteButton.value = "Delete"

    deleteButton.onclick = () => {
        deleteChat(obj.id)
        parentElem.removeChild(childElem)
    }
    childElem.appendChild(deleteButton)
}

function parseJwt(token) {
    console.log('141', token)
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Define a variable to store the selected group data

window.addEventListener('createGroup', openCreateGroupForm);

function openCreateGroupForm(previousGroupData = {}){
    // Create form content
    const formContent = `
    <form id="groupForm">
        <label for="groupName">Group Name:</label>
        <input type="text" id="groupName" name="groupName" required>
        <br>
        <label for="groupMembers">Select Members:</label>
        <div id="groupMembers" class="member-list">
            <!-- Here, you can dynamically generate checkbox inputs for group members -->
        </div>
        <button type="submit">Create Group</button>
    </form>
`;
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = formContent;
    document.body.appendChild(modal);

    // Fetch the list of users and populate the member list dynamically
    fetchUsersAndPopulateMemberList();

  // Handle form submission
    const groupForm = document.getElementById('groupForm');
    groupForm.onsubmit = async function handleFormSubmit(event) {
        event.preventDefault();
        const groupNameInput = document.getElementById('groupName');
        groupNameInput.value = previousGroupData.groupName || '';

        console.log('554))))))))))))))))))((((((((((((((((((((',groupNameInput.value)
    
        const selectedMembersCheckboxes = document.querySelectorAll('.member-checkbox');
        for (const checkbox of selectedMembersCheckboxes) {
            if (previousGroupData.selectedMembers && previousGroupData.selectedMembers.includes(checkbox.value)) {
                checkbox.checked = true;
            }
        }

       
        const groupName = document.getElementById('groupName').value;
        const selectedMembers = Array.from(document.querySelectorAll('.member-checkbox:checked')).map(checkbox => checkbox.value);
        // Example array data

        const token = localStorage.getItem('token')
        const decodeToken = parseJwt(token);
        const userId = decodeToken.userId;
        const data = {
            userId: userId,
            groupName: groupName,
            selectedMembers: selectedMembers
        }
        console.log('999999++++++++', data)
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post("http://localhost:5100/create/create-group", data, {
                headers: {
                    "Authorization": token
                }
            });
            console.log('136666666666666', response)
            localStorage.setItem('createdGroups', JSON.stringify(response.data));
            // Close the modal after group creation
            modal.remove();
            const completedListElem = document.getElementById('createdGroup');
            const completedItemElem = document.createElement('li');
            completedItemElem.id = response.data.groupData.id
            console.log('id groip******** completedItemElem.id',  completedItemElem.id)
            completedItemElem.textContent = `Group Name: ${response.data.groupData.groupName} -->Member ids: ${response.data.groupData.selectedMembers.join(', ')}`;
            completedListElem.appendChild(completedItemElem);

            const chatButton = document.createElement('input')
            chatButton.type = "button"
            chatButton.style.backgroundColor = 'red';
            chatButton.style.color = 'white';
            chatButton.value = "Chat"
            chatButton.onclick = () => {
              chat(response.data.groupData.id, response.data.groupData.groupName)
            }

            const joinGroupButton = document.createElement('input')
            joinGroupButton.type = "button"
            joinGroupButton.style.backgroundColor = 'green';
            joinGroupButton.style.color = 'white';
            joinGroupButton.value = "Join Group"
            joinGroupButton.onclick = () => {
                completedListElem.removeChild(completedItemElem);
                openCreateGroupForm({
                    groupName: response.data.groupData.groupName,
                    selectedMembers: response.data.groupData.selectedMembers
                });
            };
            completedItemElem.appendChild(joinGroupButton)
            completedItemElem.appendChild(chatButton)

            completedListElem.appendChild(completedItemElem)
        } catch (error) {
            console.log('Error creating group:', error);
        }
    };
};
    

async function fetchUsersAndPopulateMemberList() {
    try {
        const token = localStorage.getItem('token');
        const usersResponse = await axios.get("http://localhost:5100/user/group-user", {
            headers: {
                "Authorization": token
            }
        });
        console.log('119----------------->', usersResponse)


        const groupMembersDiv = document.getElementById('groupMembers');
        groupMembersDiv.innerHTML = usersResponse.data.allUsers.map(user => `
            <label>
                <input type="checkbox" class="member-checkbox" name="groupMembers" value="${user.id}">
                ${user.name}
                <br>
            </label>
        `).join('')
    } catch (error) {
        console.log('Error fetching users:', error);
    }
}
    


// function openCreateGroupForm(groupDataToRepopulate) {
//     // Create a modal or form element dynamically
//      // Create form content
//      const formContent = `
//      <form id="groupForm">
//          <label for="groupName">Group Name:</label>
//          <input type="text" id="groupName" name="groupName" required>
//          <br>
//          <label for="groupMembers">Select Members:</label>
//          <div id="groupMembers" class="member-list">
//              <!-- Here, you can dynamically generate checkbox inputs for group members -->
//          </div>
//          <button type="submit">Create Group</button>
//      </form>
//  `;
//     const modal = document.createElement('div');
//     modal.classList.add('modal');
//     modal.innerHTML = formContent;
//     document.body.appendChild(modal);

    
//     // Fetch the list of users and populate the member list dynamically
//     fetchUsersAndPopulateMemberList();

//     if () {
//         const groupNameInput = document.getElementById('groupName');
//         groupNameInput.value = groupDataToRepopulate.groupName;

//         for (const memberId of groupDataToRepopulate.selectedMembers) {
//             const memberCheckbox = document.querySelector(`.member-checkbox[value="${memberId}"]`);
//             if (memberCheckbox) {
//                 memberCheckbox.checked = true;
//             }
//         }
//     }

//     // Handle form submission
//     const groupForm = document.getElementById('groupForm');
//     groupForm.onsubmit = async function handleFormSubmit(event) {
//         event.preventDefault();
//       const groupName = document.getElementById('groupName').value;
//         console.log('88888', groupName)
//         const selectedMembers = Array.from(document.querySelectorAll('.member-checkbox:checked')).map(checkbox => checkbox.value);
        
//         selectedGroupData = {
//             groupName: groupName,
//             selectedMembers: selectedMembers
//         };
//         console.log('9000000', selectedMembers)
//         // Example array data

//         const token = localStorage.getItem('token')
//         const decodeToken = parseJwt(token);
//         const userId = decodeToken.userId;
//         const data = {
//             userId: userId,
//             groupName: groupName,
//             selectedMembers: selectedMembers
//         }
//         console.log('999999++++++++', data)
//         try {
//             const token = localStorage.getItem('token');

//             const response = await axios.post("http://localhost:5100/create/create-group", data, {
//                 headers: {
//                     "Authorization": token
//                 }
//             });
//             console.log('136666666666666', response)
//             localStorage.setItem('createdGroups', JSON.stringify(response.data));
//             // Close the modal after group creation
//             modal.remove();
//             const completedListElem = document.getElementById('createdGroup');
//             const completedItemElem = document.createElement('li');
//             completedItemElem.id = response.data.groupData.id
//             console.log('id groip******** completedItemElem.id',  completedItemElem.id)
//             completedItemElem.textContent = `Group Name: ${response.data.groupData.groupName} -->Member ids: ${response.data.groupData.selectedMembers.join(', ')}`;
//             completedListElem.appendChild(completedItemElem);

//             const chatButton = document.createElement('input')
//             chatButton.type = "button"
//             chatButton.style.backgroundColor = 'red';
//             chatButton.style.color = 'white';
//             chatButton.value = "Chat"
//             chatButton.onclick = () => {
//               chat(response.data.groupData.id, response.data.groupData.groupName)
//             }

//             const joinGroupButton = document.createElement('input')
//             joinGroupButton.type = "button"
//             joinGroupButton.style.backgroundColor = 'green';
//             joinGroupButton.style.color = 'white';
//             joinGroupButton.value = "Join Group"
//             joinGroupButton.onclick = () => {
//                 // completedListElem.removeChild(completedItemElem)
//                 openCreateGroupForm(selectedGroupData)
//             }
//             completedItemElem.appendChild(joinGroupButton)
//             completedItemElem.appendChild(chatButton)

//             completedListElem.appendChild(completedItemElem)
//         } catch (error) {
//             console.log('Error creating group:', error);
//         }
//     };
// };

// async function fetchUsersAndPopulateMemberList() {
//     try {
//         const token = localStorage.getItem('token');
//         const usersResponse = await axios.get("http://localhost:5100/user/group-user", {
//             headers: {
//                 "Authorization": token
//             }
//         });
//         console.log('119----------------->', usersResponse)


//         const groupMembersDiv = document.getElementById('groupMembers');
//         groupMembersDiv.innerHTML = usersResponse.data.allUsers.map(user => `
//             <label>
//                 <input type="checkbox" class="member-checkbox" name="groupMembers" value="${user.id}">
//                 ${user.name}
//                 <br>
//             </label>
//         `).join('')
//     } catch (error) {
//         console.log('Error fetching users:', error);
//     }
// }

