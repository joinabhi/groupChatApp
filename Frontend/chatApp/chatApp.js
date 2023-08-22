async function formSubmit(event){
    event.preventDefault();
    try{
     const token = localStorage.getItem('token')
     const decodeToken = parseJwt(token);
     const name = decodeToken.name;
     console.log('7777777777', name)
     const message=event.target.message.value;

     const obj={
        name,
        message
      }
     console.log('1555________________', obj)
     document.forms[0].reset();
    
     const response=await axios.post("http://localhost:5100/chat/add-chat", obj, {headers:{"Authorization":token}} )
     console.log('17()()()()(', response)
   
    showChatOnScreen(response.data.chat)
     }catch(error){
        console.log(error)
    }
}

window.addEventListener("DOMContentLoaded", async()=>{
    try{
        const token = localStorage.getItem('token')
        const response=await axios.get(`http://localhost:5100/chat/get-chat`, {headers:{"Authorization":token}})
        console.log('33', response)
  
        localStorage.setItem('response', JSON.stringify(response.data));
        getResponseFromLS()
        
        showChatOnScreen(response.data.allChats[response.data.allChats.length-1])
  }
   catch(error){
        console.log(error)
    }
})
// document.getElementById('createGroup').onclick=async function createGroup(){
//     try{
        
//         const token = localStorage.getItem('token')
//         const response=await axios.post(`http://localhost:5100/create/create-group`, {headers:{"Authorization":token}})
//         console.log('33', response) 
//     }catch(error){
//         console.log(error)
//     }
// }







// Assuming you have a button with id 'createGroup'
document.getElementById('createGroup').onclick = function openCreateGroupForm() {
    // Create a modal or form element dynamically
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Create form content
    const formContent = `
        <form id="groupForm">
            <label for="groupName">Group Name:</label>
            <input type="text" id="groupName" name="groupName" required>
            <label for="groupMembers">Select Members:</label>
            <div id="groupMembers" class="member-list">
                <!-- Here, you can dynamically generate checkbox inputs for group members -->
            </div>
            <button type="submit">Create Group</button>
        </form>
    `;

    modal.innerHTML = formContent;
    document.body.appendChild(modal);

    // Fetch the list of users and populate the member list dynamically
    fetchUsersAndPopulateMemberList();
    
    // Handle form submission
    const groupForm = document.getElementById('groupForm');
    groupForm.onsubmit = async function handleFormSubmit(event) {
        event.preventDefault();

        const groupName = document.getElementById('groupName').value;
        console.log('88888', groupName)
        const selectedMembers = Array.from(document.querySelectorAll('.member-checkbox:checked')).map(checkbox => checkbox.value);
        console.log('9000000', selectedMembers)
        // Example array data
       
        const data={
            groupName:groupName,
            selectedMembers:selectedMembers
        }
        console.log('999999++++++++', data)
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:5100/create/create-group", data, {
                headers: {
                    "Authorization": token
                }
            });
            console.log('Group creation response:', response);
           

            // Close the modal after group creation
            modal.remove();
            const completedListElem = document.getElementById('createdGroup');
            const completedItemElem = document.createElement('li');
            completedItemElem.textContent = `Group Name: ${response.data.groupData.groupName} -->Member ids: ${response.data.groupData.selectedMembers.join(', ')}`;
            completedListElem.appendChild(completedItemElem);
            const joinGroupButton = document.createElement('input')
            joinGroupButton.type = "button"
            joinGroupButton.style.backgroundColor = 'green';
            joinGroupButton.style.color = 'white';
            joinGroupButton.value = "Join Group"
            joinGroupButton.onclick = () => {
                completedListElem.removeChild(completedItemElem)
                openCreateGroupForm()
            }
            completedItemElem.appendChild(doneButton)
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
        console.log('119----------------->',usersResponse)

        const groupMembersDiv = document.getElementById('groupMembers');
        groupMembersDiv.innerHTML = usersResponse.data.allUsers.map(user => `
            <label>
                <input type="checkbox" class="member-checkbox" name="groupMembers" value="${user.id}">
                ${user.name}
            </label>
        `).join('');
    } catch (error) {
        console.log('Error fetching users:', error);
    }
}










// document.getElementById('joinGroup').onclick=async function joinGroup(){
//     try{
//         const token = localStorage.getItem('token')
//         const response=await axios.post(`http://localhost:5100/join/join-group`, {headers:{"Authorization":token}})
//         console.log('33', response) 
//     }catch(error){
//         console.log(error)
//     }
// }

async function getResponseFromLS(){
    const savedResponse=localStorage.getItem('response')
    // console.log('57777', savedResponse)
    if(savedResponse){
        const parsedResponse=JSON.parse(savedResponse)
        // console.log('60', parsedResponse)
        const chatsArray=parsedResponse.allChats
        console.log(chatsArray)
                for (var i = 0; i < chatsArray.length-1; i++) {
            showChatOnScreen(chatsArray[i])
  }
       
    }else{
        console.log('No saved response in localStorage')
    }
}
// async function fetchMessages(){
//     try{
//      const token=localStorage.getItem('token')
//      const response=await axios.get('http://localhost:5100/chat/get-chat', {headers:{"Authorization":token}});
//      console.log(response)
//      var Data=response.data.allChats;
//      const parentElem=document.getElementById('message-container');
//      parentElem.innerHTML=''
//      Data.forEach(message=>{
//       const childElem=document.createElement('div')
//       childElem.textContent=message.name+ ' : '+ message.message;
//       childElem.style.color = "black"; // Change the text color to blue
//       childElem.style.fontSize = "25px"; // Change the font size to 16 pixels
//       childElem.style.fontStyle = "bold"; // Apply italic style
//       parentElem.appendChild(childElem)
//      })
//      }catch(error){
//         console.log(error)
//     }
// }
// setInterval(fetchMessages, 5000)

function showChatOnScreen(obj){
    const parentElem=document.getElementById('message-container');
    const childElem=document.createElement('div')
    childElem.textContent=obj.name+ ' : '+ obj.message;
    childElem.style.color = "black"; // Change the text color to blue
    childElem.style.fontSize = "25px"; // Change the font size to 16 pixels
    childElem.style.fontStyle = "bold"; // Apply italic style
    parentElem.appendChild(childElem)
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