console.log("running backend");

document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  console.log("params are:", params);

  const page = params.get("page");

  if (page === "authorize") {

    const clientId = params.get("client_id");
    const redirectUri = params.get("redirect_uri");
    const state = params.get("state");

    if (!clientId || !redirectUri || !state) {
      alert("Missing required OAuth parameters.");
      return;
    }

    const loginBtn = document.getElementById("loginBtn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (!loginBtn || !emailInput || !passwordInput) {
      console.error("Required DOM elements not found");
      return;
    }

    loginBtn.addEventListener("click", async () => {
      const email = emailInput.value;
      const password = passwordInput.value;

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
            user_email: email,
            pass_word: password,
            redirect_uri: redirectUri,
            state
          }),
        });

        const data = await response.json();

        // Handle AWS Lambda proxy response safely
        let parsedBody = data.body;
        if (typeof parsedBody === "string") {
          parsedBody = JSON.parse(parsedBody);
        }

        if (response.ok && parsedBody?.authorizationCode) {
          alert(parsedBody.authorizationCode);

          window.location.href =
            `${redirectUri}?code=${encodeURIComponent(parsedBody.authorizationCode)}&state=${encodeURIComponent(state)}`;

        } else {
          console.error("Invalid response:", parsedBody);
          alert("Login failed or no code returned.");
        }

      } catch (error) {
        console.error("Error contacting backend:", error);
        alert("Server error");
      }
    });
  }
});
