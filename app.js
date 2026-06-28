const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXZqZGhmeHB6YXdubGl1YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE4NDEsImV4cCI6MjA5NjEzNzg0MX0.Qe30ARc6N73YbqLg2YxGgj5fv4jOz9tk-Xa0ycyhxKc";
const supabaseUrl = "https://diivjdhfxpzawnliubbk.supabase.co";
const client = supabase.createClient(supabaseUrl, supabaseKey);

const newName = document.getElementById("newName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const createAccount = document.getElementById("createAccount");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const LoginToDashboard = document.getElementById("Login-to-Dashboard");

const googleLogin = document.getElementById("google-login");
const githubLogin = document.getElementById("github-login");



async function checkActiveSession() {
  const { data: { session }, error } = await client.auth.getSession();

  if (!error && session) {
    window.location.assign("todo.html");
  }
}


document.addEventListener("DOMContentLoaded", checkActiveSession);




async function signUp(e) {
    if (e) e.preventDefault(); 
    
    
    if (!signupEmail.value || !signupPassword.value || !newName.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Opps...',
            text: 'Please fill all required fields!',
            background: 'rgba(255, 255, 255, 0.9)',
            confirmButtonColor: '#0066ff'
        });
        return;
    }

   
    Swal.showLoading();

    const { data, error } = await client.auth.signUp({
        email: signupEmail.value,
        password: signupPassword.value,
        options: {
            data: {
                first_name: newName.value
            }
        }
    });

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: error.message,
            background: 'rgba(255, 255, 255, 0.9)'
        });
        console.error(error);
        return;
    }

    if (data) {
        Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'Your account has been created successfully. Please login to continue.',
            background: 'rgba(255, 255, 255, 0.9)',
            confirmButtonColor: '#0066ff'
        });
        
        
        newName.value = "";
        signupEmail.value = "";
        signupPassword.value = "";
    }
}


async function signIn(e) {
    if (e) e.preventDefault();

    if (!loginEmail.value || !loginPassword.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Hold on!',
            text: 'Please enter both Email and Password!',
            background: 'rgba(255, 255, 255, 0.9)',
            confirmButtonColor: '#0066ff'
        });
        return;
    }

    const { data, error } = await client.auth.signInWithPassword({
        email: loginEmail.value,
        password: loginPassword.value,
    });

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: error.message,
            background: 'rgba(255, 255, 255, 0.9)'
        });
        console.error(error);
        return;
    }

    if (data) {
        Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            text: 'Redirecting to your premium dashboard...',
            timer: 1500,
            showConfirmButton: false,
            background: 'rgba(255, 255, 255, 0.9)'
        });
        
        setTimeout(() => {
            window.location.assign("todo.html");
        }, 1500);


        loginEmail.value = ""
        loginPassword.value = ""
    }
}




async function loginWithGoogle(e) {
    if (e) e.preventDefault();
    
    Swal.showLoading();

    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://pro-todo-app.vercel.app/todo.html' 
        }
    });

    if (error) {
        Swal.fire({ icon: 'error', title: 'Google Login Failed', text: error.message });
        console.error("OAuth Error:", error);
    }
}


async function loginWithGitHub(e) {
    if (e) e.preventDefault();
    
    Swal.showLoading(); 

    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: 'https://pro-todo-app.vercel.app/todo.html'
        }
    });

    if (error) {
        Swal.fire({ icon: 'error', title: 'GitHub Login Failed', text: error.message });
        console.error("GitHub Auth Error:", error);
    }
}





if (githubLogin) {
    githubLogin.addEventListener("click", loginWithGitHub);
}

if (googleLogin) {
    googleLogin.addEventListener("click", loginWithGoogle);
}


if (createAccount) {
    createAccount.addEventListener("click", signUp);
}

if (LoginToDashboard) {
    LoginToDashboard.addEventListener("click", signIn);
}

