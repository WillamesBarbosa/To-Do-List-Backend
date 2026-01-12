const taskStatus = require('../../../../src/app/domain/Task/taskStatus');

describe('Test canTrasition', ()=>{
    test('Should false and unknown current status if currentStatus not exist', ()=>{
        taskStatus.canTransition = jest.fn().mockReturnValue({
            isAllowed: false,
            message: `Unknown current status "".`,
            allowed: null,
        })

        const response = taskStatus.canTransition();

        expect(response).toEqual({
            isAllowed: false,
            message: `Unknown current status "".`,
            allowed: null,
        })
    })

    test('Should return false and cannot trasition if nextStatus does not in workflow', ()=>{
        taskStatus.canTransition = jest.fn().mockReturnValue({
            isAllowed: false,
            message: `Cannot transition "not_started" to "done"`,
            allowed: ['in_progress'],
        })

        const response = taskStatus.canTransition('not_started', 'done');

        expect(response).toEqual({
            isAllowed: false,
            message: `Cannot transition "not_started" to "done"`,
            allowed: ['in_progress'],
        })
        
    })

    test('Should return true if all is correct', ()=>{
        taskStatus.canTransition = jest.fn().mockReturnValue({
        isAllowed: true,
        message: null,
        allowed: ['in_progress'],
        })       

        const response = taskStatus.canTransition('not_started', 'in_progress');

        expect(response).toEqual({
        isAllowed: true,
        message: null,
        allowed: ['in_progress'],
        })
    })
})