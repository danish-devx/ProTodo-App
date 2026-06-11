const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXZqZGhmeHB6YXdubGl1YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE4NDEsImV4cCI6MjA5NjEzNzg0MX0.Qe30ARc6N73YbqLg2YxGgj5fv4jOz9tk-Xa0ycyhxKc";
const supabaseUrl = "https://diivjdhfxpzawnliubbk.supabase.co";
const client = supabase.createClient(supabaseUrl, supabaseKey);


const secureUpdatePasswordPage = async () => {

    const isFromResetLink = window.location.hash.includes('access_token') || 
                            window.location.search.includes('type=recovery');

    if (!isFromResetLink) {
        const { data: { session } } = await client.auth.getSession();

        if (session) {
            window.location.href = 'todo.html';
        } else {
            window.location.href = 'login.html';
        }
    }
};


secureUpdatePasswordPage();



async function handleUpdatePassword(e) {
    if (e) e.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

   
    if (newPassword !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Mismatch detected',
            text: 'Security passwords do not match. Please realign your credentials.'
        });
        return;
    }

    Swal.showLoading();

    const { data, error } = await client.auth.updateUser({
        password: newPassword
    });

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: error.message
        });
        return;
    }

  
    Swal.fire({
        icon: 'success',
        title: 'Vault Updated!',
        text: 'Your security core has been successfully updated. Redirecting to Login Portal...',
        confirmButtonColor: '#0066ff',
        timer: 3000,
        showConfirmButton: false
    });

   
    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}


const updatePasswordForm = document.getElementById("updatePasswordForm");
if (updatePasswordForm) {
    updatePasswordForm.addEventListener("submit", handleUpdatePassword);
}
