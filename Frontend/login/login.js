async function login(event) {
    event.preventDefault();
    try {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const userLogin = {
            email,
            password
        }
        document.forms[0].reset();

        const response = await axios.post("http://localhost:5100/user/add-signIn", userLogin)
        console.log('16------16--------**--16', response)
        if (response.status === 201) {
            //alert(response.data.message)

            console.log('166666666666666', response.data.token, response.data.joinedGroups)
            localStorage.setItem('token', response.data.token)
            const serializedArray = JSON.stringify(response.data.joinedGroups);
            // Construct the URL with query parameter
            const url = "../chatApp/chatApp.html" + "?groupIds=" + encodeURIComponent(serializedArray);

// Navigate to the chatApp.html page with the data
            window.location.href = url;
              // window.location.href="../chatApp/chatApp.html"
            //    response.data.joinedGroups.forEach((g)=>{
            //     showchat(g)
            //    })
              
        }
    }catch(error) {
            console.log(JSON.stringify(error))
            document.body.innerHTML += `<div style="color:red;">${error.message}</div>`
        }

    }   

    // async function showchat(id) {
    //     const savedResponse = localStorage.getItem(`chats-${id}`)
    //     // console.log('57777', savedResponse)
    //     if (savedResponse) {
    //         const parsedResponse = JSON.parse(savedResponse)
    //         // console.log('60', parsedResponse)
    //         const chatsArray = parsedResponse
    //         console.log(chatsArray)
    //         for (let i = 0; i < chatsArray.length - 1; i++) {
    //             showChatOnGroup(chatsArray[i], id)
    //         }
    
    //     } else {
    //         console.log('No saved response in localStorage')
    //     }
    // }

    // function createContainer(id){
    //     const cont = document.createElement('div');
    //     cont.className='container'
    //     cont.id = `message-${id}`
    //     const parentElem = document.getElementById('message-container');
    //     parentElem.appendChild(cont)
    //     return cont
    // }
    
    // function showChatOnGroup(obj, id){
    //     let parentElem = document.getElementById(`message-${id}`);
    //     console.log('parentElem parentElem', parentElem )
    //     if(parentElem == null){ 
    //         parentElem = createContainer(id)
    //     }
    //     const childElem = document.createElement('div')
    //     childElem.textContent = obj.name + ' : ' + obj.message;
    //     childElem.style.color = "blue"; // Change the text color to blue
    //     childElem.style.fontSize = "25px"; // Change the font size to 16 pixels
    //     childElem.style.fontStyle = "bold"; // Apply italic style
    
    //     const deleteButton = document.createElement('input')
    //     deleteButton.type = "button"
    //     deleteButton.style.backgroundColor = 'brown';
    //     deleteButton.style.color = 'white';
    //     deleteButton.value = "Delete"
    
    //     deleteButton.onclick = () => {
    //         deleteChat(obj.id)
    //         parentElem.removeChild(childElem)
    //     }
    //     childElem.appendChild(deleteButton)
    //     parentElem.appendChild(childElem)
    // }

    // window.addEventListener("DOMContentLoaded", async () => {
    //     try {
    //         const token = localStorage.getItem('token')
    //         const response = await axios.get(`http://localhost:5100/chat/get-chat`, { headers: { "Authorization": token } })
    //         console.log('33------- chtas******', response)//you have to get only last data of response but u r getting all chats in response
    //         let obj ={}
    //         console.log('response.data.allChats.', response.data.allChats)
    //         // store chats groupwise in local storage
    //         let chats = response.data.allChats
    //         for(let gid=0 ; gid< chats.length; gid++){
    //             const groupId = chats[gid].groupId == null ? 0: chats[gid].groupId
    //             console.log('-----------++++++',chats[gid], groupId)
    //             if(obj[groupId]){
    //                 // obj[groupId].push(chats[gid].message)
    //                 obj[groupId].push(chats[gid])
    //             }else{
    //                 let arr=[]
    //                 arr.push(chats[gid])
    //                 obj[groupId] = arr
    //             }
                
    //         }
    
    //         Object.entries(obj).forEach(([key, value]) => {
    //             localStorage.setItem(`chats-${key}`, JSON.stringify(value));
    //             console.log(`${key} ${value}`);
    //           })
    //         console.log('*********msg obj*********', obj)
    
    
    //         getResponseFromLS()
    
    //         // showChatOnScreen(response.data.allChats[response.data.allChats.length - 1])
           
    
    
    
    //         const response2 = await axios.get("http://localhost:5100/get/get-group", { headers: { "Authorization": token } });
    //         console.log('All group response2:', response2);
    //         const allGroups = response2.data.allGroups;
    //         allGroups.forEach(group => {
    //             const completedListElem = document.getElementById('createdGroup');
    //             const completedItemElem = document.createElement('li');
    //             const groupName = group.groupName;
    //             const selectedMembers = JSON.parse(group.selectedMembers);
    //             console.log('---------------------', group.id)
    //             completedItemElem.id = group.id
    //             groupIds.push(group.id)
    //             completedItemElem.textContent = `Group Name: ${groupName} --> Member ids: ${selectedMembers}`
    //             completedListElem.appendChild(completedItemElem);
    
    //             const chatButton = document.createElement('input')
    //             chatButton.type = "button"
    //             chatButton.style.backgroundColor = 'red';
    //             chatButton.style.color = 'white';
    //             chatButton.value = "Chat"
    //             chatButton.onclick = () => {
    //               chat(group.id)
    //               // chatHandle()
    //             }
    
    //             const joinGroupButton = document.createElement('input');
    //             joinGroupButton.type = "button";
    //             joinGroupButton.style.backgroundColor = 'green';
    //             joinGroupButton.style.color = 'white';
    //             joinGroupButton.value = "Join Group";
    //             joinGroupButton.onclick = () => {
    //                 // deleteGroup(group.id);
    //                 // completedListElem.removeChild(completedItemElem);
    
    //                 // openCreateGroupForm()
    //             }
    //             completedItemElem.appendChild(joinGroupButton);
    //             completedItemElem.appendChild(chatButton)
    
    //             completedListElem.appendChild(completedItemElem);
    //         })
    //         groupIds.forEach((id)=>{
    //             getResponseFromLS2(id)
    //         })
    
    
    
    //         createGroup.onclick = openCreateGroupForm;
    
    //     } catch (error) {
    //         console.log(error)
    //     }
    // })