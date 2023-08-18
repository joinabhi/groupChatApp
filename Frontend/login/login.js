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

        const response = axios.post("http://localhost:5100/user/add-signIn", userLogin)
        console.log('16------16----------16', response)
        if (response.status === 201) {
            alert(response.data.message)

            console.log('166666666666666', token)
            localStorage.setItem('token', response.data.token)
            //    window.location.href="../expenseTracker/expense.html"
        }
    }catch(error) {
            console.log(JSON.stringify(err))
            document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
        }

    }   