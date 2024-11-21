// Changing top tabs
function f(t) {
    ['statistics', 'weapons', 'armor', 'other', 'sets', 'runes'].map(x => document.getElementById(x).style.setProperty('display', 'none')); // Hide the tab we're navigating away from
    ['statistics-tab', 'weapons-tab', 'armor-tab', 'other-tab', 'sets-tab', 'runes-tab'].map(x => document.getElementById(x).classList.remove("tab-active")); // Show the tab we're navigating to
    document.getElementById(t).style.setProperty('display', 'flex'); // Keep flex layout for tabs
    document.getElementById(t+'-tab').classList.add("tab-active"); // Add the 'tab-active' class to the new tab to show underline
}

// Updating localStorage whenever an item is checked or unchecked
function update(t) {
    var checkbox = document.getElementById(t); // Get the checkbox being updated
    localStorage.setItem(t, checkbox.checked); // Set localStorage for that checkbox's ID to true/false based on if it's checked or unchecked, respectively
}

// Save Holy Grail as a JSON file (backing up or to reload later)
function save() {
    var dataJSON = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage)); // Create Data URI for the JSON data from localStorage
    var downloadAnchorNode = document.createElement('a'); // Create anchor element to trigger the download of the JSON file
    downloadAnchorNode.setAttribute("href", dataJSON); // Set the anchor element to the Data URI of the JSON data
    downloadAnchorNode.setAttribute("download", "BTDHolyGrail.json"); // Name the JSON file appropriately
    document.body.appendChild(downloadAnchorNode); // Add the anchor element to the DOM so it can be used
    downloadAnchorNode.click(); // Clicks the anchor element, which initiates the download of the JSON file
    downloadAnchorNode.remove(); // Remove the anchor element from the DOM, as it's no longer needed
}

// Alert that uploading a Grail JSON file will wipe your current Grail
document.getElementById('fileInput').onclick = function() {
    alert('NOTE: Loading a Holy Grail JSON file will wipe your current Holy Grail settings. If you do not wish to continue click Cancel on the \'Open\' popup.')
    document.getElementById('fileInput').click();
};

// Adds a listener for when a file is loaded via <input id="fileInput">
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the file from input

    if (file && file.type === 'application/json') { // Check the uploaded file is in JSON format
        const reader = new FileReader(); // Create a FileReader to read the file

        reader.onload = function(e) { // When file is read successfully parse and save to localStorage
            localStorage.clear(); // Clear localStorage before uploading the JSON file
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');    
            
            // Iterate through the NodeList and uncheck each checkbox
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            try {
                const jsonData = JSON.parse(e.target.result); // Parse the JSON content into a JavaScript object
                Object.keys(jsonData).forEach(function (key) { // Loop through the object
                    if (key != 'debug') {
                        const value = jsonData[key]; // Set the current loops value to the objects key
    
                        if (typeof value === 'object') { // Check if the value is an object or array then stringify; otherwise store as-is
                            localStorage.setItem(key, JSON.stringify(value));  // Store the object as a string
                        } else {
                            localStorage.setItem(key, value);  // Store primitive value directly
                        }
                        if (value === 'true') {
                            console.log('t: ' + key);
                            document.getElementById(key).checked = true;
                            // console.log("true");
                        } else {
                            console.log('e: ' + key);
                            document.getElementById(key).checked = false;
                            // console.log("false");
                        }
                    }
                });
                alert('Holy Grail has been loaded ...'); // Once the object is looped through let the user know it's been loaded
            } catch (error) {
                alert('Error parsing JSON: ' + error.message); // If there's a parsing error let the user know
            }
        };
        reader.readAsText(file); // Read the file content as text
    } else {
        alert('Please select a valid JSON file.'); // If the file is not JSON let the user know
    }
    // window.location = window.location; // Reload the page
});

// When the page loads, set all checkboxes to check or unchecked based on their localStorage value
for(let i = 0; i < localStorage.length; i++) { // For each key:value in localStorage
    if(localStorage.key(i) != 'debug') { // If the localStorage key isn't equal to 'debug' (we can skip the 'debug' key)
        var key = localStorage.key(i); // Get the key of the current loop
        var value = localStorage.getItem(key); // Get the value of the current loop

        document.getElementById(key).checked = value; // Set the proper checkbox to check/unchecked based on the true/false value in localStorage
    }
}