const form = document.getElementById("fileForm");
const resultDiv = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("file");
  const mode = document.getElementById("mode").value;
  const key = document.getElementById("key").value;

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  formData.append("mode", mode);
  formData.append("key", key);

  resultDiv.innerHTML = "Processing...";

  try {
    const response = await fetch("/process", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      resultDiv.innerHTML = `
        <p>${data.message}</p>
        <a href="${data.download}" download>Download Processed File</a>
      `;
    } else {
      resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
    }
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red;">Server error</p>`;
  }
});