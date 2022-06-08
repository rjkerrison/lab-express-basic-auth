const myUrlCreate = "../routes/readUsers.routes.js";

const allUsers = document.getElementById('allUsers')


// DOM
const allUsersContainer = document.getElementById("allUsersContainer");
const userTemplate = document.getElementById("userTemplate");
const userTplContent = droneTemplate.content;

function printAllUsers(allUsers) {
  console.log("print");
  allUsers.forEach((user) => {
    console.log(user);
    const oneUser = document.importNode(userTplContent, true);
    oneUser.querySelector(".name").textContent = drone.name;
    allUsersContainer.appendChild(oneUser);
  });
}

async function getAllUsers() {
  try {
    const response = await fetch(myUrlCreate);
    const allUsers = await response.json();
    printAllDrones(allUsers);
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener("load", () => {
  getAllUsers();
});
