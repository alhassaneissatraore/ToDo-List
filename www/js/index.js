function ajouterTache() {
    const task = document.getElementById('task').value;
    const status = document.getElementById('status').value;
    
    if (task) {
        const taskListInProgress = document.getElementById('taskListInProgress');
        const taskListCompleted = document.getElementById('taskListCompleted');
        
        let listItem = `<li>${task} <button onclick="marquerCommeTerminee(this)"><i class="fas fa-check"></i> Terminer</button> <button onclick="supprimerTache(this)"><i class="fas fa-trash"></i> Supprimer</button></li>`;
        
        if (status === 'En cours') {
            taskListInProgress.innerHTML += listItem;
            $(taskListInProgress).listview('refresh');
            ajouterGestes(taskListInProgress);
        } else if (status === 'Terminée') {
            taskListCompleted.innerHTML += listItem;
            $(taskListCompleted).listview('refresh');
        }
        
        sauvegarderTaches();
        reinitialiser();
    }
}

function marquerCommeTerminee(button) {
    const listItem = button.parentElement;
    const taskListInProgress = document.getElementById('taskListInProgress');
    const taskListCompleted = document.getElementById('taskListCompleted');
    
    taskListInProgress.removeChild(listItem);
    
    taskListCompleted.innerHTML += `<li>${listItem.innerHTML.replace('Marquer comme terminée', '')}</li>`;
    $(taskListCompleted).listview('refresh');
    
    sauvegarderTaches();
}

function supprimerTache(button) {
    const listItem = button.parentElement;
    const taskListInProgress = document.getElementById('taskListInProgress');
    const taskListCompleted = document.getElementById('taskListCompleted');
    
    if (taskListInProgress.contains(listItem)) {
        taskListInProgress.removeChild(listItem);
    } else if (taskListCompleted.contains(listItem)) {
        taskListCompleted.removeChild(listItem);
    }
    
    sauvegarderTaches();
}

function reinitialiser() {
    const task = document.getElementById('task');
    const status = document.getElementById('status');
    task.value = '';
    status.value = 'En cours';
    task.focus();
}

function sauvegarderTaches() {
    const taskListInProgress = document.getElementById('taskListInProgress').innerHTML;
    const taskListCompleted = document.getElementById('taskListCompleted').innerHTML;
    localStorage.setItem('tasksInProgress', taskListInProgress);
    localStorage.setItem('tasksCompleted', taskListCompleted);
}

function chargerTaches() {
    const taskListInProgress = document.getElementById('taskListInProgress');
    const taskListCompleted = document.getElementById('taskListCompleted');
    
    taskListInProgress.innerHTML = localStorage.getItem('tasksInProgress') || '';
    taskListCompleted.innerHTML = localStorage.getItem('tasksCompleted') || '';
    $(taskListInProgress).listview('refresh');
    $(taskListCompleted).listview('refresh');
    
    ajouterGestes(taskListInProgress);
}

function ajouterGestes(element) {
    const hammertime = new Hammer(element);
    
    hammertime.on('swipeleft', function(ev) {
        const listItem = ev.target.closest('li');
        if (listItem) {
            supprimerTache(listItem.querySelector('button'));
        }
    });
    
    hammertime.on('swiperight', function(ev) {
        const listItem = ev.target.closest('li');
        if (listItem) {
            marquerCommeTerminee(listItem.querySelector('button'));
        }
    });
}

// Charger les tâches au chargement de la page
window.onload = chargerTaches;