const jobForm = document.getElementById("jobForm");
const jobTable = document.getElementById("jobTable");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function updateStats() {
  document.getElementById("totalApps").textContent = jobs.length;
  document.getElementById("interviews").textContent = jobs.filter(job => job.status === "Interview").length;
  document.getElementById("offers").textContent = jobs.filter(job => job.status === "Offer").length;
  document.getElementById("rejections").textContent = jobs.filter(job => job.status === "Rejected").length;
}

function getStatusClass(status) {
  if (status === "Applied") return "status-applied";
  if (status === "Interview") return "status-interview";
  if (status === "Follow Up") return "status-follow-up";
  if (status === "Rejected") return "status-rejected";
  if (status === "Offer") return "status-offer";
  return "";
}

function renderJobs() {
  jobTable.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase();
  const selectedStatus = filterStatus.value;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm) ||
      job.role.toLowerCase().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "All" || job.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (filteredJobs.length === 0) {
    jobTable.innerHTML = `
      <tr>
        <td colspan="9" class="empty-message">No applications found.</td>
      </tr>
    `;
    updateStats();
    return;
  }

  filteredJobs.forEach(job => {
    const originalIndex = jobs.indexOf(job);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.role}</td>

      <td>
        <select 
          class="status-dropdown ${getStatusClass(job.status)}" 
          onchange="updateStatus(${originalIndex}, this.value)"
        >
          <option value="Applied" ${job.status === "Applied" ? "selected" : ""}>Applied</option>
          <option value="Interview" ${job.status === "Interview" ? "selected" : ""}>Interview</option>
          <option value="Follow Up" ${job.status === "Follow Up" ? "selected" : ""}>Follow Up</option>
          <option value="Rejected" ${job.status === "Rejected" ? "selected" : ""}>Rejected</option>
          <option value="Offer" ${job.status === "Offer" ? "selected" : ""}>Offer</option>
        </select>
      </td>

      <td>${job.dateApplied || "N/A"}</td>
      <td>${job.location || "N/A"}</td>
      <td>${job.salary || "N/A"}</td>
      <td>${job.link ? `<a href="${job.link}" target="_blank">Open</a>` : "N/A"}</td>
      <td>${job.notes || "N/A"}</td>

      <td>
        <button class="delete-btn" onclick="deleteJob(${originalIndex})">
          Delete
        </button>
      </td>
    `;

    jobTable.appendChild(row);
  });

  updateStats();
}

jobForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const newJob = {
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    location: document.getElementById("location").value,
    salary: document.getElementById("salary").value,
    link: document.getElementById("link").value,
    status: document.getElementById("status").value,
    dateApplied: document.getElementById("dateApplied").value,
    notes: document.getElementById("notes").value
  };

  jobs.push(newJob);
  saveJobs();
  renderJobs();
  jobForm.reset();
}

);

function updateStatus(index, newStatus) {
  jobs[index].status = newStatus;
  saveJobs();
  renderJobs();
}

function deleteJob(index) {
  jobs.splice(index, 1);
  saveJobs();
  renderJobs();
}

searchInput.addEventListener("input", renderJobs);
filterStatus.addEventListener("change", renderJobs);

renderJobs();