import request from 'supertest'
import app from '../src/app'
import * as service from '../src/services/registrationService'

jest.mock('../src/services/registrationService')

const mockedService = service as jest.Mocked<typeof service>

describe('POST /api/validate-aadhaar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 for valid Aadhaar', async () => {
    mockedService.createOrUpdateRegistration.mockResolvedValue({ registration: { aadhaar: '123456789012' } } as any)

    const response = await request(app)
      .post('/api/validate-aadhaar')
      .send({ aadhaar: '123456789012', entrepreneurName: 'Jane Doe' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({ message: expect.any(String), sent: true }))
    expect(mockedService.createOrUpdateRegistration).toHaveBeenCalledWith('123456789012', 'Jane Doe')
  })

  it('returns 400 for invalid Aadhaar format', async () => {
    const response = await request(app)
      .post('/api/validate-aadhaar')
      .send({ aadhaar: '1234', entrepreneurName: 'Jane Doe' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }))
  })

  it('returns 400 when entrepreneurName is missing', async () => {
    const response = await request(app)
      .post('/api/validate-aadhaar')
      .send({ aadhaar: '123456789012' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }))
  })
})
