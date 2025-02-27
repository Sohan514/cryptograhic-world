// Global variables to store encrypted results
let caesarOutput = '';
let vigenereOutput = '';
let railFenceOutput = '';
let rsaOutput = '';

function caesarCipher() {
    var text = document.getElementById("inputText1").value.toLowerCase();
    var shift = document.getElementById("shift").value;
    var result = "";
    
    for(var i = 0; i < text.length; i++) {
        if(text[i] >= 'a' && text[i] <= 'z') {
            var charCode = text[i].charCodeAt(0);
            var numValue = charCode - 97;
            var newNum = (numValue + parseInt(shift)) % 26;
            var newChar = String.fromCharCode(newNum + 97);
            result += newChar;
        } else {
            result += text[i];
        }
    }
    
    caesarOutput = result;
    document.getElementById("caesarresult").innerHTML = result;
}

function vigenere() {
    var text = document.getElementById("plaintext").value.toLowerCase();
    var key = document.getElementById("key").value.toLowerCase();
    var result = "";
    
    var j = 0;
    
    for(var i = 0; i < text.length; i++) {
        if(text[i] >= 'a' && text[i] <= 'z') {
            var textNum = text[i].charCodeAt(0) - 97;
            var keyNum = key[j % key.length].charCodeAt(0) - 97;
            var encryptedNum = (textNum + keyNum) % 26;
            result += String.fromCharCode(encryptedNum + 97);
            j++;
        } else {
            result += text[i];
        }
    }
    
    vigenereOutput = result;
    document.getElementById("vignereresult").innerHTML = result;
}

function railFenceCipher() {
    const text = document.getElementById('inputText').value.replace(/\s/g, '');
    const depth = parseInt(document.getElementById('depth').value);
    
    if (depth < 2) {
        alert('Depth must be at least 2');
        return;
    }
    
    let matrices = Array(depth).fill().map(() => []);

    for (let i = 0; i < text.length; i++) {
        let matrixIndex = i % depth;
        matrices[matrixIndex].push(text[i]);
    }
    
    let result = matrices.reduce((acc, matrix) => acc + matrix.join(''), '');
    
    railFenceOutput = result;
    document.getElementById('cipherresult').textContent = result;
}

function rsaEncrypt() {
    const name = document.getElementById('rsa-input').value.toLowerCase();
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const e = parseInt(document.getElementById('e').value);
    
    const n = p * q;
    let encryptedText = '';
    
    for (let char of name) {
        const m = char.charCodeAt(0) - 'a'.charCodeAt(0);
        let c = 1;
        for (let i = 0; i < e; i++) {
            c = (c * m) % n;
        }
        const encryptedChar = String.fromCharCode((c % 26) + 'a'.charCodeAt(0));
        encryptedText += encryptedChar;
    }
    
    rsaOutput = encryptedText;
    document.getElementById('rsaresult').textContent = encryptedText;
}

function compareResults() {
    let similarityCount = 0;
    const length = caesarOutput.length;

    for (let i = 0; i < length; i++) {
        let matchCount = 0;
        
        if (caesarOutput[i] === vigenereOutput[i]) matchCount++;
        if (caesarOutput[i] === railFenceOutput[i]) matchCount++;
        if (caesarOutput[i] === rsaOutput[i]) matchCount++;
        if (vigenereOutput[i] === railFenceOutput[i]) matchCount++;
        if (vigenereOutput[i] === rsaOutput[i]) matchCount++;
        if (railFenceOutput[i] === rsaOutput[i]) matchCount++;

        if (matchCount >= 1) {
            similarityCount++;
        }
    }

    return (similarityCount / length) * 100;
}

function generateReport() {
    // Check if all encryptions have been performed
    if (!caesarOutput || !vigenereOutput || !railFenceOutput || !rsaOutput) {
        alert("Please encrypt your text using all four methods first!");
        return;
    }

    // Populate table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    const results = [
        { technique: 'Caesar Cipher', original: document.getElementById('inputText1').value, encrypted: caesarOutput },
        { technique: 'Vigenère Cipher', original: document.getElementById('plaintext').value, encrypted: vigenereOutput },
        { technique: 'Rail Fence', original: document.getElementById('inputText').value, encrypted: railFenceOutput },
        { technique: 'RSA', original: document.getElementById('rsa-input').value, encrypted: rsaOutput }
    ];

    results.forEach(result => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = result.technique;
        row.insertCell(1).textContent = result.original;
        row.insertCell(2).textContent = result.encrypted;
    });

    // Make table visible
    document.getElementById('comparison-table').style.display = 'table';

    // Calculate similarity and show message
    const similarityPercentage = compareResults();
    const message = document.getElementById('security-message');
    
    message.style.display = 'block';
    if (similarityPercentage > 50) {
        message.className = 'message warning';
        message.textContent = '😟 Your name is easily hackable! The similarity percentage is ' + 
            similarityPercentage.toFixed(2) + '%';
    } else {
        message.className = 'message success';
        message.textContent = '🎉 Strong name! The similarity percentage is ' + 
            similarityPercentage.toFixed(2) + '%';
    }
}