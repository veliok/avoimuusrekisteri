import { renderTargets } from "./views/targets.js";
import { renderCompanies } from "./views/companies.js";
import { renderTarget } from "./views/target.js";
import { renderCompany } from "./views/company.js";
import { renderHome } from "./views/home.js";
import { renderInfo } from "./views/info.js";

const routes = [
  // Static routing
  { path: "#targets", render: renderTargets },
  { path: "#companies", render: renderCompanies },
  { path: "#home", render: renderHome },
  { path: "#info", render: renderInfo },
  // Dynamic routing
  { path: "#target/:id", render: renderTarget },
  { path: "#company/:id", render: renderCompany }
];

export function initRouter() {
  window.addEventListener("hashchange", changeView);
  changeView();
}

function changeView() {
  const container = document.getElementById("content-container");
  clearView(container);

  const hash = window.location.hash || "#home";
  const route = getRoute(hash);

  if (route) {
    route.render(container, route.params);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Hide hero in info view
    if (route.path == "#info") document.querySelector("#hero").style.display = "none";
    else document.querySelector("#hero").style.display = "block";
  };
}

function clearView(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  };
}

function getRoute(hash) {
  // Get subview id for dynamic routes
  const id = hash.split("/")[1];
  if (id) hash = hash.split("/")[0] + "/:id";

  for (const route of routes) {
    if (route.path === hash) {
      return { ...route, params: id }
    }
  };
}