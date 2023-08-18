async function signUp(event) {
    event.preventDefault(); // Prevents the default form submission behavior
    // Extract the form input values
    try{
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        const phoneNumber = event.target.phoneNumber.value
        // Create a user object with the extracted values
        const user = {
            name,
            email,
            password,
            phoneNumber
        };
        // Reset the form fields
        document.forms[0].reset();
        // Send a POST request to the backend API using Axios
        const response = await axios.post("http://localhost:5100/user/add-signUp", user)
            if (response.status === 201) {
                alert(response.data.message)
            } else if (response.status === 400) {
                alert("user already exists");
         } 
    }catch (error) {
        console.log(JSON.stringify(error))
        document.body.innerHTML += `<div style="color:red;">${error.message}</div>`
    }
}