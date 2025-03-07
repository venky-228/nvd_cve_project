/*document.addEventListener("DOMContentLoaded", async function () {
    let cveId = window.location.pathname.split("/").pop(); // Get CVE ID from URL

    let response = await fetch(`http://localhost:8000/cves/${cveId}`);
    if (!response.ok) {
        document.body.innerHTML = "<h1>CVE Not Found</h1><button onclick='window.history.back()'>Go Back</button>";
        return;
    }

    let data = await response.json();

    document.getElementById("cveId").textContent = data.cve_id;
    document.getElementById("description").textContent = data.description;
    document.getElementById("baseScore").textContent = data.base_score || "N/A";
    document.getElementById("publishedDate").textContent = data.published_date || "N/A";
    document.getElementById("lastModified").textContent = data.last_modified || "N/A";
});

document.addEventListener("DOMContentLoaded", async function () {
    // Extract the CVE ID from the query parameters
    let params = new URLSearchParams(window.location.search);
    let cveId = params.get("cve_id");

    if (!cveId) {
        document.body.innerHTML = "<h1>Invalid CVE ID</h1><button onclick='window.history.back()'>Go Back</button>";
        return;
    }

    let response = await fetch(`http://localhost:8000/cves/${cveId}`);
    
    if (!response.ok) {
        document.body.innerHTML = "<h1>CVE Not Found</h1><button onclick='window.history.back()'>Go Back</button>";
        return;
    }

    let data = await response.json();

    document.getElementById("cveId").textContent = data.cve_id;
    document.getElementById("description").textContent = data.description;
    document.getElementById("baseScore").textContent = data.base_score || "N/A";
    document.getElementById("publishedDate").textContent = data.published_date || "N/A";
    document.getElementById("lastModified").textContent = data.last_modified || "N/A";
});

document.addEventListener("DOMContentLoaded", async function () {
    // Get CVE ID from URL parameters
    let params = new URLSearchParams(window.location.search);
    let cveId = params.get("cveId");

    if (!cveId) {
        document.body.innerHTML = "<h1>Invalid CVE ID</h1><button onclick='window.history.back()'>Go Back</button>";
        return;
    }

    let response = await fetch(`http://localhost:8000/cves/${cveId}`);
    if (!response.ok) {
        document.body.innerHTML = "<h1>CVE Not Found</h1><button onclick='window.history.back()'>Go Back</button>";
        return;
    }

    let data = await response.json();

    // Populate the page with CVE details
    document.getElementById("cveId").textContent = data.cve_id;
    document.getElementById("description").textContent = data.description;
    document.getElementById("baseScore").textContent = data.base_score || "N/A";
    document.getElementById("publishedDate").textContent = data.published_date || "N/A";
    document.getElementById("lastModified").textContent = data.last_modified || "N/A";
});
*/
document.addEventListener("DOMContentLoaded", async function () {
    let cveId = document.getElementById("cveId").textContent; // Get CVE ID from HTML

    let response = await fetch(`http://localhost:8000/api/cves/${cveId}`); // Fetch from API
    if (!response.ok) {
        document.body.innerHTML = "<h1>CVE Not Found</h1><button onclick='window.history.back()'>Go Back</button>";
        return;
    }

    let data = await response.json();

    document.getElementById("description").textContent = data.description;
    document.getElementById("baseScore").textContent = data.base_score || "N/A";
    document.getElementById("publishedDate").textContent = data.published_date || "N/A";
    document.getElementById("lastModified").textContent = data.last_modified || "N/A";
});
