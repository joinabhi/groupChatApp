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
        console.log('16------16----------16', response)
        if (response.status === 201) {
            alert(response.data.message)

            console.log('166666666666666', response.data.token)
            localStorage.setItem('token', response.data.token)
               window.location.href="../chatApp/chatApp.html"
        }
    }catch(error) {
            console.log(JSON.stringify(error))
            document.body.innerHTML += `<div style="color:red;">${error.message}</div>`
        }

    }   