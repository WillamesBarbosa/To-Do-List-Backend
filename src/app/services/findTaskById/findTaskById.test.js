    const findTaskById = require("./findTaskById");

    describe('findTaskById tests', ()=>{
        const bd = [
            {
                "id": "fb56587100f2c2bddee9c8b4b3676c4390969e6f8cf68f295427e852804b1ed9",
                "title": "aaaaaaaaaaa",
                "description": "sadasdad"
            },
            {
                "id": "cabfbd41a2b6fe99831eed179d8713fa3cc0d91d8722431db7ff3bc4d5287e98",
                "title": "bbbbbbbbbbbbbb",
                "description": "sadasdad"
            }
        ];


        test('Should return index and task', ()=>{
            const id = 'cabfbd41a2b6fe99831eed179d8713fa3cc0d91d8722431db7ff3bc4d5287e98';
            const task = findTaskById(id, bd);

            expect(task.index).toEqual(1);
            expect(task.task).toHaveProperty('title', 'bbbbbbbbbbbbbb');
        })

        test('should return null', ()=>{
            const id = '1';
            const task = findTaskById(id, bd);

            expect(task).toEqual(null);
        })
    })