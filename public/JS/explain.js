function flipCard(card, number) {
    card.classList.toggle("flipped");
  
    if (card.classList.contains("flipped")) {
      card.querySelector(".crypto-img-back").addEventListener("click", function () {
        document.getElementById("contributors").scrollIntoView({ behavior: "smooth" });
      });
    }
  
    const inputText = document.getElementById("inputText").value;
    const x = inputText.length;
    let y = '';
  
    for (let i = 0; i < x; i++) {
      y = y + '*';
    }
  
    if (number === 1) {
      document.getElementById("output1").textContent = y;
    } else {
      document.getElementById("output2").textContent = inputText;
    }
  }
  