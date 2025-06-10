  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  if (page === "authorize") {
    // Inputs to Get Code
    const clientId = params.get("client_id");
    const redirectUri = params.get("redirect_uri");
    const state = params.get("state");

  // Get Values from Login Page
    document.getElementById("loginBtn").addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;


      // Debug Purpose
      console.log(redirectUri);
      console.log(state);
      if(!redirectUri){
        console.log("No Redirect URI");
      };
      // TODO: Validate credentials (locally or call backend)

  try {
    const response = await fetch("https://sqiur7epsh.execute-api.ap-south-1.amazonaws.com/production/account_linking1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        redirectUri,
        state
      }),
    });

    const data = await response.json();

    if (response.ok && data.code) {
      console.log(data);
      // Redirect back to Alexa with the auth code and state
      window.location.href = `${redirectUri}?code=${data.code}&state=${state}`;
    } else {
      alert("Login failed or no code returned.");
    }
  } catch (error) {
    console.error("Error contacting backend:", error);
    alert("Server error");
  }



      
      // After login success, redirect back to Alexa
      //const code = "abc123"; // Normally from backend or generated
      //window.location.href = `${redirectUri}?code=${code}&state=${state}`;
    });
  }
