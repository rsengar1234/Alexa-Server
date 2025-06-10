  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

if (page === "authorize") {

const clientId = params.get("client_id");
const redirectUri = params.get("redirect_uri");
const state = params.get("state");

if (clientId && redirectUri && state) {
  document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch("https://sqiur7epsh.execute-api.ap-south-1.amazonaws.com/production/account_linking1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email : email,
          pass_word : password ,
          redirect_uri: redirectUri, // use underscore
          state
        }),
      });

      const data = await response.json();
      //const data_string = JSON.parse(data);
      if (response.ok && data.authorizationCode) {
        console.log(data);
        //console.log(data_string);
        //console.log(data_string.authorizationCode);
       // window.location.href = `${redirectUri}?code=${encodeURIComponent(data.code)}&state=${encodeURIComponent(state)}`;
      } else {
        alert("Login failed or no code returned.");
      }
    } catch (error) {
      console.error("Error contacting backend:", error);
      alert("Server error");
    }
  });
} else {
  alert("Missing required OAuth parameters.");
}

  }
