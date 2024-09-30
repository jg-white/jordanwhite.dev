const fs = require('fs');
const path = require('path');

// Get the API URL from command-line arguments
const apiUrl = process.argv[2];
if (!apiUrl) {
    console.error('Please provide the API URL as a parameter.');
    process.exit(1);
}

// Path to the main HTML file
const htmlFilePath = path.resolve(__dirname, 'index.html');

// Read the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading HTML file:', err);
        process.exit(1);
    }

    // Replace the placeholder with the actual API URL
    const updatedHtml = data.replace(/{{API_URL}}/g, apiUrl);

    // Write the updated HTML back to the file
    fs.writeFile(htmlFilePath, updatedHtml, 'utf8', (err) => {
        if (err) {
            console.error('Error writing updated HTML file:', err);
            process.exit(1);
        }
        console.log('HTML file updated successfully.');
    });
});
