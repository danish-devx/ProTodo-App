
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXZqZGhmeHB6YXdubGl1YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE4NDEsImV4cCI6MjA5NjEzNzg0MX0.Qe30ARc6N73YbqLg2YxGgj5fv4jOz9tk-Xa0ycyhxKc";
const supabaseUrl = "https://diivjdhfxpzawnliubbk.supabase.co";
const client = supabase.createClient(supabaseUrl, supabaseKey);

const editToggleBtn = document.getElementById("edit-toggle-btn");
const discardBtn = document.getElementById("discard-btn");

const nameField = document.getElementById("profileName");
const emailField = document.getElementById("profileEmail");

const titleName = document.getElementById("title-name");
const titleEmail = document.getElementById("title-email");


let originalName = "";
let originalEmail = "";


async function userInfoFill() {
  const { data: { user }, error } = await client.auth.getUser();
  
  if (user) {
    originalName = user.user_metadata.first_name || "Premium User";
    originalEmail = user.email || "";

    titleName.innerText = originalName;
    titleEmail.innerText = originalEmail;

    nameField.value = originalName;
    emailField.value = originalEmail;
  }
}

userInfoFill();


async function handleProfileToggle() {
  
 
  if (nameField.hasAttribute("disabled")) {
    
   
    nameField.removeAttribute("disabled");
    emailField.removeAttribute("disabled");
    nameField.focus();

    editToggleBtn.innerHTML = `
      <i class="fa-solid fa-floppy-disk"></i>
      <span id="btn-label">Save Changes</span>
    `;
    discardBtn.style.display = "block";

  } else {
    
    
    if (!nameField.value.trim() || !emailField.value.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Fields',
        text: 'Name and Email fields cannot be empty!',
        confirmButtonColor: '#0066ff'
      });
      return;
    }

    
    editToggleBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Saving...</span>`;
    editToggleBtn.disabled = true;

    const { data, error } = await client.auth.updateUser({
      email: emailField.value,
      data: {
        first_name: nameField.value,
      }
    });

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message,
        confirmButtonColor: '#0066ff'
      });
      
      editToggleBtn.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        <span id="btn-label">Save Changes</span>
      `;
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
        timer: 2000,
        showConfirmButton: false
      });

      originalName = nameField.value;
      originalEmail = emailField.value;

      titleName.innerText = originalName;
      titleEmail.innerText = originalEmail;

      closeEditMode();
    }
    
   
    editToggleBtn.disabled = false;
  }
}


function closeEditMode() {
  nameField.setAttribute("disabled", "true");
  emailField.setAttribute("disabled", "true");

  editToggleBtn.innerHTML = `
    <i class="fa-solid fa-pen-to-square"></i>
    <span id="btn-label">Edit Profile</span>
  `;
  discardBtn.style.display = "none";
}

editToggleBtn.addEventListener("click", handleProfileToggle);


discardBtn.addEventListener("click", () => {
  nameField.value = originalName;
  emailField.value = originalEmail;
  closeEditMode();
});






const avatarDisplay = document.getElementById("avatar-display");
const avatarInput = document.getElementById("avatar-input");


avatarInput.addEventListener("change", function () {

  let file = avatarInput.files[0];
  
  if (file) {
    avatarDisplay.src = URL.createObjectURL(file);
  }

});



