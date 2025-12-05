jest.mock("../../../../src/app/services/authenticationService/authenticationService");


const authenticationService = require("../../../../src/app/services/authenticationService/authenticationService");
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
        authenticationService.mockResolvedValue({
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
        authenticationService.mockResolvedValue({
            isValid: true,
            decoded: { id: '123e4567-e89b-42d3-a456-426614174000'}
        })
        const request = {
            headers: { authorization:
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTk5OTk5OTl9.mockSignature'    

            }
        }

        await authenticationMiddleware(request, response, next);

        //verify if next are called
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
        expect(request.id).toEqual('123e4567-e89b-42d3-a456-426614174000')
            
    })
})