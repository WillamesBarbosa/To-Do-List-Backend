const TASK_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
}

const TASK_STATUS_WORKFLOW = {
    [TASK_STATUS.NOT_STARTED]: [TASK_STATUS.IN_PROGRESS],
    [TASK_STATUS.IN_PROGRESS]: [TASK_STATUS.NOT_STARTED, TASK_STATUS.DONE],
    [TASK_STATUS.DONE]: [TASK_STATUS.IN_PROGRESS],
}

function canTransition(currentStatus, nextStatus){
    const allowed = TASK_STATUS_WORKFLOW[currentStatus]
    if(!allowed){
        return{
            isAllowed: false,
            message: `Unknown current status "${currentStatus}".`,
            allowed: null,
        }
    }
    
    const changeAllowed = TASK_STATUS_WORKFLOW[currentStatus].includes(nextStatus);
    
    // Garante que em alguma inconsistencia no banco, não venha ocorrer nenhum erro. Caso esteja com status null ou algo semenlhante
    if(!changeAllowed){
        return {
            isAllowed: false,
            message: `Cannot transition "${currentStatus}" to "${nextStatus}"`,
            allowed,
        }
    }

    return {
        isAllowed: true,
        message: null,
        allowed,
    }
}

module.exports =  {
    TASK_STATUS, 
    TASK_STATUS_WORKFLOW, 
    canTransition 
}