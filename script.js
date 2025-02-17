let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let currentReminder = null; // Recordatorio activo
const postponeMinutes = 5; // Posponer 5 minutos

// Solicitar permiso de notificaciones
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones.");
    return;
  }
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      console.log("Permiso de notificaciones:", permission);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requestNotificationPermission();
  loadReminders();
});

// Agregar recordatorio
document.getElementById('reminderForm').addEventListener('submit', e => {
  e.preventDefault();
  const message = document.getElementById('message').value;
  const timeInput = document.getElementById('time').value;
  const reminderTime = new Date(timeInput);

  if (reminderTime <= new Date()) {
    alert("Ingresa una fecha y hora futuras.");
    return;
  }

  const reminder = { message, time: reminderTime.toISOString() };
  reminders.push(reminder);
  localStorage.setItem('reminders', JSON.stringify(reminders));
  displayReminders();
  scheduleReminder(reminder);
  document.getElementById('reminderForm').reset();
});

// Cargar recordatorios existentes y programarlos
function loadReminders() {
  reminders.forEach(r => {
    const remTime = new Date(r.time);
    const delay = remTime - new Date();
    if (delay > 0) {
      setTimeout(() => { triggerReminder(r); }, delay);
    }
  });
  displayReminders();
}

// Mostrar recordatorios en la lista
function displayReminders() {
  const remindersDiv = document.getElementById('reminders');
  remindersDiv.innerHTML = "";
  reminders.forEach((r, index) => {
    const div = document.createElement('div');
    div.classList.add('reminder');
    div.innerHTML = `
      <p><strong>${r.message}</strong></p>
      <p>${new Date(r.time).toLocaleString()}</p>
      <button onclick="deleteReminder(${index})">Eliminar</button>
    `;
    remindersDiv.appendChild(div);
  });
}

// Programar un recordatorio
function scheduleReminder(reminder) {
  const remTime = new Date(reminder.time);
  const delay = remTime - new Date();
  if (delay > 0) {
    setTimeout(() => { triggerReminder(reminder); }, delay);
  }
}

// Eliminar recordatorio
function deleteReminder(index) {
  reminders.splice(index, 1);
  localStorage.setItem('reminders', JSON.stringify(reminders));
  displayReminders();
}

// Función para disparar el recordatorio: sonido y modal
function triggerReminder(reminder) {
  currentReminder = reminder;
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.loop = true;
  alarmSound.play();

  // Mostrar el modal con fondo verde
  document.getElementById('modalMessage').innerText = reminder.message;
  document.getElementById('notificationModal').style.display = "flex";

  // Si se tiene permiso, también muestra la notificación nativa
  if (Notification.permission === "granted") {
    let notification = new Notification("⏰ Recordatorio", {
      body: reminder.message,
      icon: "https://img.icons8.com/color/96/alarm.png",
      requireInteraction: true
    });
    notification.onclick = () => {
      notification.close();
      closeModal();
    };
  }
}

// Función para posponer el recordatorio 5 minutos
function postponeReminder() {
  if (currentReminder) {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.pause();
    alarmSound.currentTime = 0;
    // Calcular el nuevo tiempo (5 minutos más tarde)
    let newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + postponeMinutes);
    currentReminder.time = newTime.toISOString();

    // Actualizar el recordatorio en el array (buscando por mensaje)
    let index = reminders.findIndex(r => r.message === currentReminder.message);
    if (index !== -1) {
      reminders[index].time = currentReminder.time;
      localStorage.setItem('reminders', JSON.stringify(reminders));
    }
    // Cerrar modal y reprogramar el recordatorio
    closeModal();
    scheduleReminder(currentReminder);
    displayReminders();
  }
}

// Función para cerrar el modal y detener el sonido
function closeModal() {
  document.getElementById('notificationModal').style.display = "none";
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

// Función para abrir WhatsApp sin mensaje ni número
function openWhatsApp() {
  window.open('https://api.whatsapp.com/', '_blank');
}

// Eventos para los botones del modal
document.getElementById('whatsappBtn').addEventListener('click', openWhatsApp);
document.getElementById('postponeBtn').addEventListener('click', postponeReminder);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
