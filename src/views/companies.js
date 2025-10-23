import { getCompanyData } from "../main.js";

export function renderCompanies(container) {
  const section = document.createElement("div");
  section.className = "content";

  const title = document.createElement("h1");
  const grid = document.createElement("div");
  title.textContent = "Organisaatiot";
  grid.id = "button-grid";

  const companyData = getCompanyData();

  companyData.forEach(company => {
    const companyButton = document.createElement("button");
    companyButton.textContent = company.name;
    
    companyButton.addEventListener("click", () => {
      if (company.id) window.location.hash = `#company/${company.id}`;
      else window.location.hash = `#company/${company.otherCompanyId}`;
    });

    grid.appendChild(companyButton);
  })

  section.appendChild(title);
  section.appendChild(grid);
  container.appendChild(section);
}