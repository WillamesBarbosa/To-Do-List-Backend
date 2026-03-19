jest.mock("../../../../src/app/utils/helpers/authenticationToken/authenticationToken", ()=> jest.fn());

const authenticationToken = require("../../../../src/app/utils/helpers/authenticationToken/authenticationToken");
const next = jest.fn();
const ErrorsHTTP = require("../../../../src/app/utils/helpers/ErrorsHTTP");
const responsesHTTP = require("../../../../src/app/utils/helpers/responsesHTTPS");
const authenticationMiddleware = require("../../../../src/middlewares/authenticationMiddleware/authenticationMiddleware");

let response;

beforeEach(()=>{
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
})

describe('Test authenticationMiddleware', ()=>{
    test('Should return BAD REQUEST', async()=>{
        await authenticationMiddleware({headers: ''}, response, next);

        //verify if next are called
        expect(next).toHaveBeenCalled();

        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ErrorsHTTP)
        expect(error.message).toEqual(responsesHTTP.BAD_REQUEST.message)
        expect(error.statusCode).toEqual(responsesHTTP.BAD_REQUEST.status)
            
    })

    test('Should return BAD REQUEST and Token Invalid', async()=>{
        const msg = {error: 'Token invalid.'}
        authenticationToken.mockReturnValue({
            isValid: false,
            message: { error: 'Token invalid.' }
        })

        await authenticationMiddleware({ headers: {authorization: 'askjdbaskjdnasjdas'} }, response, next);

        //verify if next are called
        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ErrorsHTTP)
        expect(error.message).toEqual(msg)
        expect(error.statusCode).toEqual(responsesHTTP.UNAUTHORIZED.status)
            
    })

    test('Should inject id in request', async()=>{
        authenticationToken.mockReturnValue({
            isValid: true,
            decoded: { id: 'fake-id'}
        })
        const request = {
            headers: { authorization:
                'Bearer fake-token-jwt'    

            }
        }

        await authenticationMiddleware(request, response, next);

        //verify if next are called
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
        expect(request.id).toEqual('fake-id')
            
    })
})