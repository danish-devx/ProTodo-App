const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaXZqZGhmeHB6YXdubGl1YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjE4NDEsImV4cCI6MjA5NjEzNzg0MX0.Qe30ARc6N73YbqLg2YxGgj5fv4jOz9tk-Xa0ycyhxKc";
const supabaseUrl = "https://diivjdhfxpzawnliubbk.supabase.co";
const client = supabase.createClient(supabaseUrl, supabaseKey);

const logoutBtn = document.getElementById("logout");

const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");
const taskDesc = document.getElementById("taskDesc");
const num = document.getElementById("num");
const show = document.getElementById("show");
const addBtn = document.getElementById("add-btn");


async function checkUserSession() {
   
    const { data: { session }, error } = await client.auth.getSession();

    if (error || !session) {
        window.location.href = "index.html";
    } else {
        addTasks();
    }
}


document.addEventListener("DOMContentLoaded", checkUserSession);




async function signOut(e) {
    if (e) e.preventDefault();

  
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be safely logged out from your active session!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#4e617d',
        confirmButtonText: 'Yes, Sign Out',
        background: 'rgba(255, 255, 255, 0.9)'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { error } = await client.auth.signOut();
            
            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error logging out',
                    text: error.message
                });
                return;
            }

            
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully',
                text: 'See you again soon!',
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                window.location.assign("index.html");
            }, 1500);
        }
    });
}





async function createTask(e) {
    if (e) e.preventDefault();

    if (!taskTitle.value.trim() || !taskDesc.value.trim()) {
        Swal.fire({ icon: 'warning', title: 'Empty Fields', text: 'Please fill out Title and Description!' });
        return;
    }

    const { data: { user } } = await client.auth.getUser();
    if (!user) return;

   
    if (currentEditingTaskId !== null) {
        Swal.showLoading();
        
        const { error } = await client
            .from('todos')
            .update({
                title: taskTitle.value.trim(),
                description: taskDesc.value.trim(),
                category: taskCategory.value
            })
            .eq('id', currentEditingTaskId);

        if (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.message });
            return;
        }

        Swal.fire({ icon: 'success', title: 'Task Updated!', timer: 1200, showConfirmButton: false });
        
       
        currentEditingTaskId = null;
        addBtn.innerHTML = ` <span>Add Task to Board</span>
                            <i class="fa-solid fa-plus"></i>`;
        addBtn.style.background = "var(--primary-color)";
        
        taskTitle.value = "";
        taskDesc.value = "";
        addTasks();
        return; 
    }

    
    Swal.showLoading();
    const { data, error } = await client
        .from('todos')
        .insert([
            {
                user_id: user.id,
                title: taskTitle.value.trim(),
                description: taskDesc.value.trim(),
                category: taskCategory.value,
                is_completed: false
            }
        ])
        .select("*");

    if (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
        return;
    }

    if (data) {
        Swal.fire({ icon: 'success', title: 'Task Added!', timer: 1200, showConfirmButton: false });
        taskTitle.value = "";
        taskDesc.value = "";
        addTasks();
    }
}





async function addTasks() {
    
    const { data: { user } } = await client.auth.getUser();
    if (!user) return;

   
    const { data, error } = await client
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

    if (error) {
        console.error("Fetch Error: ", error);
        return;
    }

    if (data) {
       
        if (num) {
            num.innerText = data.length;
        }

       
        show.innerHTML = "";

       
        if (data.length === 0) {
            show.innerHTML = `<p style="color: var(--text-muted); font-weight: 500; grid-column: 1/-1; text-align: center; padding: 40px 0;">No tasks found. Create a new task to get started!</p>`;
            return;
        }

        
        data.forEach(task => {
            let borderClass = "work-border";
            let badgeClass = "badge-work";
            
            if (task.category && task.category.toLowerCase() === "urgent") {
                borderClass = "urgent-border";
                badgeClass = "badge-urgent";
            } else if (task.category && task.category.toLowerCase() === "personal") {
                borderClass = "personal-border";
                badgeClass = "badge-personal";
            }

           
            show.innerHTML += `
                <div class="task-card ${borderClass}" data-id="${task.id}">
                    <div class="card-top">
                        <span class="tag-badge ${badgeClass}">${task.category}</span>
                        <button class="check-btn" title="Mark as Complete" 
                             onclick="toggleComplete('${task.id}', ${task.is_completed})" 
                             style="${task.is_completed ? 'background: #22c55e; color:#ffffff; border-color:#22c55e;' : ''}">
                             <i class="fa-solid fa-check"></i>
                        </button>
                    </div>
                    <h3 class="task-card-title" style="${task.is_completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</h3>
                    <p class="task-card-desc" style="${task.is_completed ? 'opacity: 0.5;' : ''}">${task.description || 'No description provided.'}</p>
                    <div class="card-actions">
                        <button class="action-btn edit" title="Edit Task" onclick="editTask('${task.id}')">
                            <i class="fa-regular fa-pen-to-square"></i> Edit
                        </button>
                        <button class="action-btn delete" title="Delete Task" onclick="deleteTask('${task.id}')">
                            <i class="fa-regular fa-trash-can"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });
    }
}






let currentEditingTaskId = null;


async function deleteTask(id) {
   
    Swal.fire({
        title: 'Delete Task?',
        text: "Are you sure you want to remove this task permanently?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#4e617d',
        confirmButtonText: 'Yes, Delete It',
        background: 'rgba(255, 255, 255, 0.9)'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.showLoading();

            const { error } = await client
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: error.message });
                console.error(error);
                return;
            }

            Swal.fire({ icon: 'success', title: 'Task Deleted!', timer: 1000, showConfirmButton: false });
            
          
            addTasks();
        }
    });
}






async function editTask(id) {
   
    const { data, error } = await client
        .from('todos')
        .select('*')
        .eq('id', id)
        .single(); 

    if (error) {
        console.error(error);
        return;
    }

    if (data) {
      
        taskTitle.value = data.title;
        taskDesc.value = data.description || "";
        taskCategory.value = data.category;

        currentEditingTaskId = id;

        addBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Update Task`;
        addBtn.style.background = "#22c55e"; 
    }
}






async function toggleComplete(id, currentStatus) {
   
    const newStatus = !currentStatus;

   
    Swal.showLoading();

    const { error } = await client
        .from('todos')
        .update({ is_completed: newStatus })
        .eq('id', id);

    if (error) {
        Swal.fire({ icon: 'error', title: 'Status Update Failed', text: error.message });
        console.error(error);
        return;
    }


    Swal.fire({
        icon: 'success',
        title: newStatus ? 'Task Completed!' : 'Task Reopened',
        timer: 1000,
        showConfirmButton: false
    });

   
    addTasks();
}









if (logoutBtn) logoutBtn.addEventListener("click", signOut);
if (addBtn) addBtn.addEventListener("click", createTask);

// document.addEventListener("DOMContentLoaded", () => {
//     addTasks();
// });



