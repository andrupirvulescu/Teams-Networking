const e = require("express");

fetch("http://localhost:3000/teams-json", {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(r => r.json())
  .then(teams => {
    displayTeams(teams);
    return "nu";
  });

function displayTeams(teams) {
  const teamsHTML = teams.map(
    team => `
            <tr>
        <td>${team.promotion}</td>
        <td>${team.members}</td>
        <td>${team.name}</td>
        <td>${team.url}</td>
        <td>
          <a data-id="$(team.id)">❌</a>
        </td>
        </tr>`
  );
  document.querySelector("#teams tbody").innerHTML = teamsHTML.join("");
}
function onSubmit(e) {
  e.preventDefault();

  fetch("http://localhost:3000/teams-json/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      promotion: document.getElementById("promotion").value,
      members: document.getElementById("members").value,
      name: document.getElementById("name").value,
      url: document.getElementById("url").value
    })
  })
    .then(r => r.json())
    .then(status => {
      console.warn("status", status.success, status.id);
      if (status.success) {
        window.location.reload();
      }
    });
}
function deleteTeamRequest(id) {
  return fetch("http://localhost:3000/teams-json/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  }).then(r => r.json());
}
function initEvents() {
  const form = document.getElementById("editForm");
  form.addEventListener("submit", onSubmit);

  document.querySelector("#teams tbody").addEventListener("click", e => {
    if (e.target.matches("a")) {
      const id = e.target.dataset.id;
      deleteTeamRequest(id).then(status => {
        console.info("s", status);
        window.location.reload();
      });
    }
  });
}

initEvents();
