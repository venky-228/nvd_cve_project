let currentPage = 1;
let perPage = 10;

document.getElementById("perPage").addEventListener("change", function () {
    perPage = this.value;
    currentPage = 1;
    fetchData();
});

document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        fetchData();
    }
});

document.getElementById("nextPage").addEventListener("click", function () {
    currentPage++;
    fetchData();
});
document.getElementById("cveTable").addEventListener("click", function (event) {
    let row = event.target.closest("tr"); // Get the closest row
    if (!row || !row.cells[0]) return; // Ensure it's a valid row
    let cveId = row.cells[0].textContent; // Get CVE ID
    window.location.href = `http://localhost:8000/cves/${cveId}`;; // Redirect to details page
    
});

async function fetchData() {
    let response = await fetch(`http://localhost:8000/cves/list?page=${currentPage}&per_page=${perPage}`);
    let data = await response.json();

    document.getElementById("totalRecords").textContent = data.total_records;
    document.getElementById("currentPage").textContent = data.current_page;

    let table = document.getElementById("cveTable").querySelector("tbody");
    table.innerHTML = "";

    data.cves.forEach(cve => {
        let row = table.insertRow();
        row.insertCell(0).textContent = cve.cve_id;
        row.insertCell(1).textContent = cve.description;
        row.insertCell(2).textContent = cve.base_score;
        row.insertCell(3).textContent = cve.published_date;
    });

    // Disable "Previous" button on first page
    document.getElementById("prevPage").disabled = currentPage === 1;
    
    // Disable "Next" button if there are no more results
    document.getElementById("nextPage").disabled = data.cves.length < perPage;
}

// Fetch data on page load
fetchData();
