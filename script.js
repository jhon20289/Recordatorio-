document.addEventListener("DOMContentLoaded", function() {
    const reminderForm = document.getElementById("reminderForm");
    const remindersContainer = document.getElementById("reminders");

    reminderForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const message = document.getElementById("message").value;
        const time = document.getElementById("time").value;

        if (!message || !time) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const reminder = {
            message: message,
            time: new Date(time).getTime()
        };

        saveReminder(reminder);
        renderReminders();
    });

    function saveReminder(reminder) {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.push(reminder);
        localStorage.setItem("reminders", JSON.stringify(reminders));
    }

    function renderReminders() {
        remindersContainer.innerHTML = "";
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];

        reminders.forEach((reminder, index) => {
            const reminderElement = document.createElement("div");
            reminderElement.classList.add("reminder");
            reminderElement.innerHTML = `
                <strong>${reminder.message}</strong><br>
                ${new Date(reminder.time).toLocaleString()}<br>
                <button class="delete-btn" data-index="${index}">Eliminar</button>
            `;
            remindersContainer.appendChild(reminderElement);
        });

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                deleteReminder(this.dataset.index);
            });
        });
    }

    function deleteReminder(index) {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.splice(index, 1);
        localStorage.setItem("reminders", JSON.stringify(reminders));
        renderReminders();
    }

    function checkReminders() {
        let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        const now = new Date().getTime();

        reminders.forEach((reminder, index) => {
            if (reminder.time <= now) {
                showNotification(reminder.message);
                reminders.splice(index, 1);
            }
        });

        localStorage.setItem("reminders", JSON.stringify(reminders));
        renderReminders();
    }

    function showNotification(message) {
        alert("Recordatorio: " + message);
    }

    renderReminders();
    setInterval(checkReminders, 60000);
});
