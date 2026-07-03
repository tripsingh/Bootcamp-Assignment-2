import express from 'express'
import cors from 'cors'
import registrationRoutes from './routes/registrationRoutes'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', registrationRoutes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
