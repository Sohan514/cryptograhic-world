const CORRECT_ANSWERS = {
    challenge1: "security code: well_tested_secured", // Fixed to match exact decryption
    challenge2: "password: binary_master",
    challenge3: "123456", // This is the plain text of the MD5 hash e10adc3949ba59abbe56e057f20f883e
  };

  // Get elements
  const challenge1 = document.getElementById("challenge1");
  const challenge2 = document.getElementById("challenge2");
  const challenge3 = document.getElementById("challenge3");
  const lockerRoom = document.getElementById("lockerRoom");
  const congratsScreen = document.getElementById("congratsScreen");
  const trapMessage = document.getElementById("trapMessage");
  const progressBar = document.getElementById("progressBar");
  const challengeNumber = document.getElementById("challengeNumber");
  const wantedImage = document.getElementById("wantedImage");

  // Challenge 1 (Caesar Cipher) - FIXED
  document
    .getElementById("challenge1Submit")
    .addEventListener("click", function () {
      // Get user answer and normalize it for comparison
      const userAnswer = document
        .getElementById("challenge1Input")
        .value.trim()
        .toLowerCase();
      const resultElement = document.getElementById("challenge1Result");

      // Check multiple valid formats - now allows for variation in the answer
      const validAnswers = [
        "security code: well_tested_secured",
        "security_code: well_tested_secured",
        "security code:well_tested_secured",
        "security_code:well_tested_secured",
      ];

      if (validAnswers.includes(userAnswer)) {
        resultElement.textContent =
          "Correct! Access granted to the next level.";
        resultElement.className = "success-message";

        // Move to challenge 2 after a brief delay
        setTimeout(() => {
          challenge1.classList.remove("active");
          challenge2.classList.add("active");
          progressBar.style.width = "33%";
          challengeNumber.textContent = "Challenge: 2/3";
        }, 1500);
      } else {
        resultElement.textContent =
          "Incorrect. Try again with a different shift key.";
        resultElement.className = "error-message";
      }
    });

  // Challenge 2 (Binary to ASCII)
  document
    .getElementById("challenge2Submit")
    .addEventListener("click", function () {
      const userAnswer = document
        .getElementById("challenge2Input")
        .value.trim()
        .toLowerCase();
      const resultElement = document.getElementById("challenge2Result");

      if (userAnswer === CORRECT_ANSWERS.challenge2) {
        resultElement.textContent = "Correct! Binary successfully decoded.";
        resultElement.className = "success-message";

        // Move to challenge 3 after a brief delay
        setTimeout(() => {
          challenge2.classList.remove("active");
          challenge3.classList.add("active");
          progressBar.style.width = "66%";
          challengeNumber.textContent = "Challenge: 3/3";
        }, 1500);
      } else {
        resultElement.textContent =
          "Incorrect. Check your binary conversion.";
        resultElement.className = "error-message";
      }
    });

  // Challenge 3 (MD5 Hash)
  document
    .getElementById("challenge3Submit")
    .addEventListener("click", function () {
      const userAnswer = document
        .getElementById("challenge3Input")
        .value.trim();
      const resultElement = document.getElementById("challenge3Result");

      if (userAnswer === CORRECT_ANSWERS.challenge3) {
        resultElement.textContent =
          "Password correct! Breaking into the vault...";
        resultElement.className = "success-message";

        // Simulate loading
        resultElement.innerHTML += ' <div class="loading"></div>';

        // Move to locker room after a brief delay
        setTimeout(() => {
          challenge3.classList.remove("active");
          lockerRoom.style.display = "block";
          progressBar.style.width = "100%";
          challengeNumber.textContent = "All Challenges Complete!";

          // Show congrats screen after a short delay
          setTimeout(() => {
            congratsScreen.style.display = "flex";
          }, 3000);
        }, 2000);
      } else {
        resultElement.textContent =
          "Incorrect hash. Try another common password.";
        resultElement.className = "error-message";
      }
    });

  // Trap activation
  document
    .getElementById("completeHeist")
    .addEventListener("click", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("realName").value.trim();
      const selfieInput = document.getElementById("selfieUpload");

      // Check if inputs are provided
      if (nameInput === "" || !selfieInput.files[0]) {
        alert("Please provide both your name and a selfie to proceed.");
        return;
      }

      // Show loading simulation
      this.textContent = "Processing...";
      this.disabled = true;

      // Activate the trap after a brief delay
      setTimeout(() => {
        document.getElementById(
          "capturedInfo"
        ).textContent = `Information captured: Name: "${nameInput}" | Image data collected | Device information recorded`;

        // Display the uploaded image in the wanted poster
        const file = selfieInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
          wantedImage.src = e.target.result;
        };

        reader.readAsDataURL(file);

        congratsScreen.style.display = "none";
        trapMessage.style.display = "flex";
      }, 2000);
    });

  // Add helpful functions for solving the challenges
  // For Challenge 1 - Caesar cipher decoder
  function decodeCaesar(str, shift) {
    return str
      .split("")
      .map((char) => {
        // Handle only letters, leave spaces and special characters unchanged
        if (/[a-z]/i.test(char)) {
          const code = char.charCodeAt(0);
          const isUpperCase = code >= 65 && code <= 90;
          const offset = isUpperCase ? 65 : 97;

          // Apply shift and ensure it wraps correctly (modulo 26)
          return String.fromCharCode(
            ((code - offset - shift + 26) % 26) + offset
          );
        }
        return char;
      })
      .join("");
  }

  // For Challenge 2 - Binary to ASCII conversion
  function binaryToASCII(binary) {
    return binary
      .split(" ")
      .map((byte) => String.fromCharCode(parseInt(byte, 2)))
      .join("");
  }

  // Console helper for users to decrypt Challenge 1
  console.log(
    "Hint for Challenge 1: Try using the caesarDecode function in the console:"
  );
  console.log(
    "To decrypt the message with a shift of 4: caesarDecode('Hvtlivkp eldv: xlii_kvjkvw_svxfivw', 4)"
  );

  // Make decoding functions available in global scope for console use
  window.caesarDecode = decodeCaesar;
  window.binaryToASCII = binaryToASCII;

  // Print hints to console
  console.log(
    "Challenge 1 hint: The encrypted text uses a Caesar cipher with a shift of 4"
  );
  console.log(
    "Challenge 2 hint: Use binaryToASCII function with the binary string to decode it"
  );
  console.log(
    "Challenge 3 hint: The MD5 hash e10adc3949ba59abbe56e057f20f883e decodes to a very common password"
  );