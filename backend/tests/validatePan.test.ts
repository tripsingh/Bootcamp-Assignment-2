import request from 'supertest'
import app from '../src/app'
import * as service from '../src/services/registrationService'

jest.mock('../src/services/registrationService')

const mockedService = service as jest.Mocked<typeof service>

describe('POST /api/validate-pan', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 404 when Aadhaar does not exist', async () => {
    mockedService.findRegistrationByAadhaar.mockResolvedValue(null)

    const response = await request(app)
      .post('/api/validate-pan')
      .send({ aadhaar: '000000000000', pan: 'ABCDE1234F', panType: 'individual' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(404)
    expect(response.body).toEqual(expect.objectContaining({ error: expect.any(String) }))
  })

  it('returns 400 for invalid PAN format', async () => {
    const response = await request(app)
      .post('/api/validate-pan')
      .send({ aadhaar: '123456789012', pan: 'invalid', panType: 'individual' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }))
  })

  it('returns 200 for a valid PAN request', async () => {
    mockedService.findRegistrationByAadhaar.mockResolvedValue({ aadhaar: '123456789012' } as any)
    mockedService.updatePan.mockResolvedValue({ aadhaar: '123456789012', pan: 'ABCDE1234F', panType: 'individual' } as any)

    const response = await request(app)
      .post('/api/validate-pan')
      .send({ aadhaar: '123456789012', pan: 'ABCDE1234F', panType: 'individual' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({ message: expect.any(String) }))
    expect(mockedService.updatePan).toHaveBeenCalledWith('123456789012', 'ABCDE1234F', 'individual')
  })
})
