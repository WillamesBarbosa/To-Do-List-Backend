function updateTask(title, description, taskForUpdate, bd){
    const { index } = taskForUpdate;

    bd[index] = {...taskForUpdate.task, title, description};

    return bd[index];

}

module.exports = updateTask;