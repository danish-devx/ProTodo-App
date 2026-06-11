const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXZqZGhmeHB6YXdubGl1YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE4NDEsImV4cCI6MjA5NjEzNzg0MX0.Qe30ARc6N73YbqLg2YxGgj5fv4jOz9tk-Xa0ycyhxKc";
const supabaseUrl = "https://diivjdhfxpzawnliubbk.supabase.co";
const client = supabase.createClient(supabaseUrl, supabaseKey);



const checkActiveSession = async () => {
    const { data: { session } } = await client.auth.getSession();
    
    if (session) {
        window.location.href = 'todo.html'; 
    }

};

checkActiveSession();


async function handleForgotPassword(e) {
    if (e) e.preventDefault();

    const emailInput = document.getElementById("email");
    if (!emailInput) return;
    
    const email = emailInput.value.trim();

    Swal.showLoading(); 

  
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://pro-todo-app.vercel.app/updatepassword.html',
        //  redirectTo: 'http://127.0.0.1:5500/updatepassword.html',
        
    });

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Reset Failed',
            text: error.message
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Reset Link Sent!',
        text: 'A secure password recovery link has been orchestrated to your email vault.',
        confirmButtonColor: '#0066ff'
    });
    
    const forgotForm = document.getElementById("forgotForm");
    if (forgotForm) forgotForm.reset();
}


const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
    forgotForm.addEventListener("submit", handleForgotPassword);
}
