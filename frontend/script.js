let currentPage = 1;
let perPage = 10;
let baseScoreMin = 0;
let baseScoreMax = 10;

document.getElementById("perPage").addEventListener("change", function () {
    perPage = this.value;
    currentPage = 1;
    applyFilters();
});

document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        applyFilters();
    }
});

document.getElementById("nextPage").addEventListener("click", function () {
    currentPage++;
    applyFilters();
});

document.getElementById("cveTableBody").addEventListener("click", function (event) {
    let row = event.target.closest("tr"); // Get the closest row
    if (!row || !row.cells[0]) return; // Ensure it's a valid row
    let cveId = row.cells[0].textContent; // Get CVE ID
    window.location.href = `http://localhost:8000/cves/${cveId}`;; // Redirect to details page
    
});

document.getElementById("baseScoreMin").addEventListener("change", function () {
    console.log("baseScoreMin: "+this.value);
    baseScoreMin = this.value;
});

document.getElementById("baseScoreMax").addEventListener("change", function () {
    console.log("baseScoreMax: "+this.value);
    baseScoreMax = this.value;
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

async function applyFilters() {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = ""; // Clear previous errors

    // Get filter values
    const publishedAfterInput = document.getElementById("publishedAfter").value;
    const publishedBeforeInput = document.getElementById("publishedBefore").value;
    const minInput = document.getElementById("baseScoreMin").value.trim();
    const maxInput = document.getElementById("baseScoreMax").value.trim();
    const searchTerm = document.getElementById("searchTerm").value.trim();

    /* Date Validation */
    if (publishedAfterInput && publishedBeforeInput) {
        const afterDate = new Date(publishedAfterInput);
        const beforeDate = new Date(publishedBeforeInput);
        
        if (afterDate > beforeDate) {
            errorMessage.textContent = "Error: 'Published After' date cannot be later than 'Published Before' date.";
            return;
        }
    }

    /* Score Validation */
    let effectiveMin = 0;
    let effectiveMax = 10;

    // Validate min input
    if (minInput !== "") {
        const parsedMin = parseFloat(minInput);
        if (isNaN(parsedMin)) {
            errorMessage.textContent = "Error: Invalid minimum score value.";
            return;
        }
        effectiveMin = parsedMin;
    }

    // Validate max input
    if (maxInput !== "") {
        const parsedMax = parseFloat(maxInput);
        if (isNaN(parsedMax)) {
            errorMessage.textContent = "Error: Invalid maximum score value.";
            return;
        }
        effectiveMax = parsedMax;
    }

    // Check score range validity
    if (effectiveMin > effectiveMax) {
        errorMessage.textContent = "Error: Minimum score cannot exceed maximum score.";
        return;
    }

    // Format dates for API
    const publishedAfter = formatDateForAPI(publishedAfterInput);
    const publishedBefore = formatDateForAPI(publishedBeforeInput);

    // Build URL with validated parameters
    let url = `http://localhost:8000/cves/list?page=${currentPage}&per_page=${perPage}`;

    // Only add score parameters if they have values
    if (minInput) url += `&base_score_min=${minInput}`;
    if (maxInput) url += `&base_score_max=${maxInput}`;

    if (publishedAfter) url += `&published_after=${publishedAfter}`;
    if (publishedBefore) url += `&published_before=${publishedBefore}`;
    if (searchTerm) url += `&search_term=${encodeURIComponent(searchTerm)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Update UI
        document.getElementById("totalRecords").textContent = data.total_records;
        document.getElementById("currentPage").textContent = data.current_page;

        const tableBody = document.getElementById("cveTable").querySelector("tbody");
        tableBody.innerHTML = "";

        if (data.total_records === 0) {
            // Create a message row when no data is found - with non-clickable styling
            const messageRow = document.createElement('tr');
            messageRow.style.pointerEvents = 'none'; // Disable click events
            messageRow.innerHTML = `
                <td colspan="4">
                    <div class="no-data-message" style="text-align: center; padding: 20px; 
                         background-color: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;
                         pointer-events: auto;"> <!-- Re-enable pointer events for the button only -->
                        <p style="margin: 5px 0;">No CVE records found matching your filters.</p>
                        <p style="margin: 5px 0;">Try adjusting your search criteria:</p>
                        <ul style="text-align: left; margin: 10px 0;">
                            <li>Widen the date range</li>
                            <li>Adjust the base score range</li>
                            <li>Modify or clear the search terms</li>
                        </ul>
                        <button type="button" 
                                onclick="event.stopPropagation(); clearAllFilters();" 
                                style="background-color: #007bff; color: white; border: none; 
                                       padding: 8px 16px; border-radius: 4px; cursor: pointer; 
                                       margin-top: 10px; pointer-events: auto;">
                            Clear All Filters
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(messageRow);

            // Disable pagination buttons
            document.getElementById("prevPage").disabled = true;
            document.getElementById("nextPage").disabled = true;
        } else {
            // Add data rows if we have results
            data.cves.forEach(cve => {
                const row = tableBody.insertRow();
                const idCell = row.insertCell(0);
                const descCell = row.insertCell(1);
                const scoreCell = row.insertCell(2);
                const dateCell = row.insertCell(3);

                // Create a proper link for CVE ID
                idCell.innerHTML = `<a href="/cves/${cve.cve_id}" class="cve-link">${cve.cve_id}</a>`;
                descCell.textContent = cve.description;
                scoreCell.textContent = cve.base_score;
                dateCell.textContent = cve.published_date;
            });

            // Update pagination controls
            document.getElementById("prevPage").disabled = currentPage === 1;
            document.getElementById("nextPage").disabled = data.cves.length < perPage;
        }
        
    } catch (error) {
        console.error("Error fetching data:", error);
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = "Failed to load data. Please try again.";
        
        // Display error in table - with non-clickable styling
        const tableBody = document.getElementById("cveTable").querySelector("tbody");
        const errorRow = document.createElement('tr');
        errorRow.style.pointerEvents = 'none'; // Disable click events
        errorRow.innerHTML = `
            <td colspan="4">
                <div style="text-align: center; padding: 20px; background-color: #f8d7da; 
                            border-radius: 4px; border: 1px solid #f5c6cb; color: #721c24;">
                    Error loading CVE data. Please try again later.
                </div>
            </td>
        `;
        tableBody.innerHTML = '';
        tableBody.appendChild(errorRow);
    }
}

// Modified clear filters function
function clearAllFilters(event) {
    // Prevent any event propagation
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    document.getElementById("baseScoreMin").value = "";
    document.getElementById("baseScoreMax").value = "";
    document.getElementById("publishedAfter").value = "";
    document.getElementById("publishedBefore").value = "";
    document.getElementById("searchTerm").value = "";
    
    // Reset to first page and apply filters
    currentPage = 1;
    applyFilters();
}

function formatDateForAPI(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', function() {
    // Add all your event listeners here
    document.getElementById("perPage")?.addEventListener("change", function () {
        perPage = this.value;
        currentPage = 1;
        applyFilters();
    });

    document.getElementById("prevPage")?.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            applyFilters();
        }
    });

    document.getElementById("nextPage")?.addEventListener("click", function () {
        currentPage++;
        applyFilters();
    });

    // Add other event listeners...

    // Initial load
    applyFilters();
});
