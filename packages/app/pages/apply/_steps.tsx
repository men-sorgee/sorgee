import { Steps, Step, useSteps } from 'chakra-ui-steps'
import { ApplicationStatus } from 'lib/models'
import { useEffect } from 'react'
import { Show } from '@chakra-ui/react'
export default function ApplicationSteps({ status }: { status: string }) {
  const steps = ['Registration', 'Identification', 'Verification', 'Agreement']
  const { activeStep, setStep } = useSteps({
    initialStep: -1,
  })
  useEffect(() => {
    if (status && activeStep == -1) setStep(ApplicationStatus[status])
  }, [status])
  return (
    <Show above="md">
      <Steps activeStep={activeStep} my={8}>
        {steps.map((step, index) => (
          <Step title={step} key={index} />
        ))}
      </Steps>
    </Show>
  )
}
