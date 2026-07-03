import { Router } from 'express'
import { validateAadhaar, verifyOtp, validatePan, submitRegistration } from '../controllers/registrationController'
import { validateRequest } from '../middlewares/validateRequest'
import { validateAadhaarSchema, verifyOtpSchema, validatePanSchema, submitSchema } from '../schemas/registration'

const router = Router()

router.post('/validate-aadhaar', validateRequest(validateAadhaarSchema), validateAadhaar)
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp)
router.post('/validate-pan', validateRequest(validatePanSchema), validatePan)
router.post('/submit', validateRequest(submitSchema), submitRegistration)

export default router
