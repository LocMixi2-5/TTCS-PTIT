const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
  try {
    const formData = new FormData();
    // we use test_cv.pdf
    const filePath = path.join(__dirname, '../test_cv.pdf');
    formData.append('file', fs.createReadStream(filePath), { filename: 'cv.pdf' });
    formData.append('top_k', '20');
    formData.append('min_score', '0.3');

    console.log("Sending request to ai-worker...");
    const response = await axios.post('http://localhost:8000/api/ai/match', formData, {
      headers: formData.getHeaders(),
    });
    console.log("SUCCESS:", response.data);
  } catch (err) {
    console.error("ERROR CAUGHT!");
    console.error(err);
    if (err.response) {
      console.error("Response Data:", err.response.data);
      console.error("Response Status:", err.response.status);
    }
  }
}
testUpload();
