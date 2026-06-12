const editToggleBtn = document.getElementById("edit-toggle-btn");
const discardBtn = document.getElementById("discard-btn");
const nameField = document.getElementById("profileName");
const emailField = document.getElementById("profileEmail");
const labelText = document.getElementById("btn-label");
const iconElement = editToggleBtn.querySelector("i");

const titleName = document.getElementById("title-name");
const titleEmail = document.getElementById("title-email");

let editState = false;
let cachedName = nameField.value;
let cachedEmail = emailField.value;

editToggleBtn.addEventListener("click", () => {
  if (!editState) {
    editState = true;
    nameField.disabled = false;
    emailField.disabled = false;
    nameField.focus();

    labelText.innerText = "Save Changes";
    iconElement.className = "fa-solid fa-floppy-disk";
    discardBtn.style.display = "block";
  } else {
    editState = false;
    nameField.disabled = true;
    emailField.disabled = true;

    titleName.innerText = nameField.value;
    titleEmail.innerText = emailField.value;

    cachedName = nameField.value;
    cachedEmail = emailField.value;

    labelText.innerText = "Edit Profile";
    iconElement.className = "fa-solid fa-pen-to-square";
    discardBtn.style.display = "none";
  }
});

discardBtn.addEventListener("click", () => {
  editState = false;
  nameField.disabled = true;
  emailField.disabled = true;

  nameField.value = cachedName;
  emailField.value = cachedEmail;

  labelText.innerText = "Edit Profile";
  iconElement.className = "fa-solid fa-pen-to-square";
  discardBtn.style.display = "none";
});
