
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
let currentUserId = ""; 


async function checkProfileSession() {
    const { data: { session }, error } = await client.auth.getSession();

    if (error || !session) {
      window.location.href = "index.html";
      return; 
    }
    
  
    userInfoFill();
}


document.addEventListener("DOMContentLoaded", checkProfileSession);



async function userInfoFill() {
  const { data: { user }, error } = await client.auth.getUser();
  
  if (user) {
    currentUserId = user.id; 
    
    originalName = user.user_metadata.first_name || "Premium User";
    originalEmail = user.email || "";

    titleName.innerText = originalName;
    titleEmail.innerText = originalEmail;

    nameField.value = originalName;
    emailField.value = originalEmail;

  
    if (user.user_metadata.avatar_url) {
        document.getElementById("avatar-display").src = user.user_metadata.avatar_url;
    }
  }
}


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

avatarInput.addEventListener("change", async function (event) {
  const avatarFile = event.target.files[0];
  
  if (!avatarFile) return;


  avatarDisplay.src = URL.createObjectURL(avatarFile);

  
  const fileExt = avatarFile.name.split('.').pop();
  const fileName = `avatar_${currentUserId}.${fileExt}`;

 
  Swal.fire({
    title: 'Uploading...',
    text: 'Saving your profile picture to Supabase vault.',
    allowOutsideClick: false,
    didOpen: () => { Swal.showLoading(); }
  });

 
  const { data: uploadData, error: uploadError } = await client
    .storage
    .from('avatars')
    .upload(fileName, avatarFile, {
      cacheControl: '3600',
      upsert: true 
    });

  if (uploadError) {
    Swal.close();
    Swal.fire({ icon: 'error', title: 'Upload Failed', text: uploadError.message });
    return;
  }


  const { data: { publicUrl } } = client
    .storage
    .from('avatars')
    .getPublicUrl(fileName);

 
  const { data: userData, error: userError } = await client.auth.updateUser({
    data: {
      avatar_url: publicUrl
    }
  });

  Swal.close(); 

  if (userError) {
    Swal.fire({ icon: 'error', title: 'Failed to Link Avatar', text: userError.message });
  } else {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Avatar updated successfully!',
      timer: 2000,
      showConfirmButton: false
    });
   
    avatarDisplay.src = publicUrl;
  }
});
