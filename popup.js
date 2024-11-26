document.addEventListener("DOMContentLoaded", function () {
    const apiList = document.getElementById("apiList");
    const addApiBtn = document.getElementById("addApiBtn");
  
    // Load stored APIs when the popup opens
    chrome.storage.local.get("apiLinks", function (result) {
      if (result.apiLinks) {
        result.apiLinks.forEach(addApiToList);
      }
    });
  
    // Function to add an API item to the list
    function addApiToList(apiData) {
      const apiItem = document.createElement("div");
      apiItem.classList.add("api-item");
  
      // Create a clickable link
      const apiLink = document.createElement("a");
      apiLink.href = apiData.url; // Set href to the saved URL
      apiLink.target = "_blank"; // Open link in a new tab
      apiLink.textContent = `${apiData.category}: ${apiData.url}`; // Display category and URL
  
      // Create a checkbox for marking as important
      const importantCheckbox = document.createElement("input");
      importantCheckbox.type = "checkbox";
      importantCheckbox.checked = apiData.important || false; // Set initial state
      importantCheckbox.style.marginRight = "10px";
  
      // Update storage when the checkbox state changes
      importantCheckbox.addEventListener("change", function () {
        chrome.storage.local.get("apiLinks", function (result) {
          const apiLinks = result.apiLinks || [];
          const updatedLinks = apiLinks.map(api => {
            if (api.url === apiData.url) {
              return { ...api, important: importantCheckbox.checked };
            }
            return api;
          });
  
          // Save only the important APIs
          const importantLinks = updatedLinks.filter(api => api.important);
          chrome.storage.local.set({ apiLinks: importantLinks });
        });
      });
  
      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", function () {
        // Remove item from the list and storage
        apiList.removeChild(apiItem);
        removeApiFromStorage(apiData.url);
      });
  
      // Append elements to the item
      apiItem.appendChild(importantCheckbox);
      apiItem.appendChild(apiLink);
      apiItem.appendChild(deleteBtn);
  
      // Add item to the list
      apiList.appendChild(apiItem);
    }
  
    // Add API to the list and save to storage
    addApiBtn.addEventListener("click", function () {
      const apiUrl = document.getElementById("apiUrl").value;
      const apiCategory = document.getElementById("apiCategory").value;
      const apiDescription = document.getElementById("apiDescription").value;
  
      if (apiUrl && apiCategory) {
        const apiData = {
          url: apiUrl,
          category: apiCategory,
          description: apiDescription,
          important: false, // Default state for new APIs
        };
  
        // Add API to the list
        addApiToList(apiData);
  
        // Save to Chrome storage
        chrome.storage.local.get("apiLinks", function (result) {
          const apiLinks = result.apiLinks || [];
          apiLinks.push(apiData);
          chrome.storage.local.set({ apiLinks: apiLinks });
        });
  
        // Clear input fields
        document.getElementById("apiUrl").value = "";
        document.getElementById("apiCategory").value = "";
        document.getElementById("apiDescription").value = "";
      } else {
        alert("Please fill out both the API URL and Category.");
      }
    });
  
    // Remove API from Chrome storage
    function removeApiFromStorage(url) {
      chrome.storage.local.get("apiLinks", function (result) {
        const apiLinks = result.apiLinks || [];
        const updatedLinks = apiLinks.filter(api => api.url !== url);
        chrome.storage.local.set({ apiLinks: updatedLinks });
      });
    }
  });
  