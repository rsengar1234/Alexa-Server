const params = new URLSearchParams(window.location.search);
const page = params.get("page");
const messageElement = document.getElementById("message");

if (page === "authorize") {
    const clientId = params.get("client_id");
    const redirectUri = params.get("redirect_uri");
    const state = params.get("state");

    if (clientId && redirectUri && state) {
        document.getElementById("loginBtn").addEventListener("click", async () => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (!email || !password) {
                messageElement.innerText = "Please enter email and password.";
                return;
            }

            messageElement.innerText = "Processing...";

            try {
                const response = await fetch("https://amazonaws.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_email: email,
                        pass_word: password,
                        redirect_uri: redirectUri,
                        state: state
                    }),
                });

                const data = await response.json();
                
                // Safely handle the body parsing
                let responseBody = typeof data.body === "string" ? JSON.parse(data.body) : data.body;

                if (response.ok && responseBody && responseBody.authorizationCode) {
                    messageElement.innerText = "Success! Redirecting...";
                    // Immediate redirect (Crucial for iOS)
                    window.location.href = `${redirectUri}?code=${encodeURIComponent(responseBody.authorizationCode)}&state=${encodeURIComponent(state)}`;
                } else {
                    messageElement.innerText = "Login failed: " + (responseBody.message || "Invalid credentials");
                }
            } catch (error) {
                console.error("Error contacting backend:", error);
                messageElement.innerText = "Server error. Please try again.";
            }
        });
    } else {
        messageElement.innerText = "Error: Missing OAuth parameters from Alexa.";
    }
}
