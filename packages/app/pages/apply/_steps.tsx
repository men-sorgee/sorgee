import { Steps, Step, useSteps } from 'chakra-ui-steps'
import { ApplicationStatus } from 'lib/models'
import { useEffect } from 'react'

export default function ApplicationSteps({ status }: { status: string }) {
  const steps = ['Authentication', 'Registration', 'Identification', 'Verification', 'Agreement']
  const { activeStep, setStep } = useSteps({
    initialStep: -1,
  })
  useEffect(() => {
    if (status && activeStep == -1) setStep(ApplicationStatus[status])
  }, [status])
  return (
    <Steps activeStep={activeStep}>
      {steps.map((step, index) => (
        <Step title={step} key={index} />
      ))}
    </Steps>
  )
}
