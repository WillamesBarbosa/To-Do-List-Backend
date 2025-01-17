function findTaskById(id, bd){
   const index = bd.findIndex(task=> task.id === id);
   if(index === -1) return null;   

   return {index, task: bd[index]}
}

module.exports = findTaskById