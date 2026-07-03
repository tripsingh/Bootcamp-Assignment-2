import request from 'supertest'
import app from '../src/app'
import * as service from '../src/services/registrationService'

jest.mock('../src/services/registrationService')

const mockedService = service as jest.Mocked<typeof service>

describe('POST /api/submit', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 404 when registration does not exist', async () => {
    mockedService.submitRegistration.mockResolvedValue(null)

    const response = await request(app)
      .post('/api/submit')
      .send({ aadhaar: '000000000000' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(404)
    expect(response.body).toEqual(expect.objectContaining({ error: expect.any(String) }))
  })

  it('returns 400 when registration exists but is incomplete', async () => {
    mockedService.submitRegistration.mockResolvedValue({ incomplete: true })

    const response = await request(app)
      .post('/api/submit')
      .send({ aadhaar: '123456789012' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body).toEqual(expect.objectContaining({ error: expect.any(String) }))
  })

  it('returns 201 when submission succeeds', async () => {
    mockedService.submitRegistration.mockResolvedValue({ aadhaar: '123456789012', submittedAt: new Date() } as any)

    const response = await request(app)
      .post('/api/submit')
      .send({ aadhaar: '123456789012' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(201)
    expect(response.body).toEqual(expect.objectContaining({ message: expect.any(String) }))
  })
})
