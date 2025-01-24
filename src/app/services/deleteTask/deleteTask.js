function deleteTask(index, bd){

    bd.splice(index, 1);
}

module.exports = deleteTask;