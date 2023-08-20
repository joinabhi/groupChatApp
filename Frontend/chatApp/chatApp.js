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
        const response=await axios.get("http://localhost:5100/chat/get-chat", {headers:{"Authorization":token}})
        console.log('24>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<',response)
        for (var i = 0; i < response.data.allChats.length; i++) {
            showChatOnScreen(response.data.allChats[i])
  }
}

    catch(error){
        console.log(error)
    }
})

function showChatOnScreen(obj){
    const parentElem=document.getElementById('message-container');
    const childElem=document.createElement('li')
    childElem.textContent=obj.name+ '->'+ obj.message;
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