import { initRouter } from "./router.js";

let targetData = [], companyData = [], activityData = [],
    companyStats = [], targetStats = [];

export function getTargetData() { return targetData };
export function getCompanyData() { return companyData };
export function getActivityData() { return activityData };
export function getCompanyStats() { return companyStats };
export function getTargetStats() { return targetStats };

document.addEventListener("DOMContentLoaded", onLoad);

async function onLoad() {
  [targetData, activityData, companyData, companyStats, targetStats] = await Promise.all([
    readJSON("/data/targets.json"),
    readJSON("/data/activities.json"),
    readJSON("/data/companies.json"),
    readJSON("/data/company_stats.json"),
    readJSON("/data/target_stats.json"),
  ]);

  initRouter();

  // View change listener
  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = btn.dataset.route;
    });
  });
  // Search input listener
  document.querySelector("#search-bar").addEventListener("input", search);

  // Back to top button
  const toTop = document.getElementById("to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      toTop.classList.add("show");
    } else {
      toTop.classList.remove("show");
    }
  });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

async function readJSON(filename) {
  const response = await fetch(filename);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

// Search bar
function search(event) {
  const input = event.target.value.toLowerCase();
  const searchResult = document.querySelector("#search-list");
  const searchBar = document.querySelector("#search-bar");

  // Clear previous results
  searchResult.innerHTML = "";
  if (!input) return;

  // Filter valid names
  const match = targetData
    .filter(t => t.name && t.name.toLowerCase().includes(input));

  // Create list element for every matching result and render
  for (const target of match) {
    const li = document.createElement("li");
    li.textContent = target.name;

    // Make list elements clickable
    li.addEventListener("click", () => {
      document.querySelector("#search-bar").value = target.name;
      window.location.hash = `#target/${target.id[0]}`;
      searchResult.innerHTML = "";
      searchBar.value = "";
    })
    searchResult.appendChild(li);
  }
}