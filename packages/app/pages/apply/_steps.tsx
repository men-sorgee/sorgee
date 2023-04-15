import { Steps, Step, useSteps } from 'chakra-ui-steps'
import { ApplicationStatus } from 'lib/models'
import { useEffect } from 'react'
import { Show, Hide } from '@chakra-ui/react'
export default function ApplicationSteps({ status }: { status: string }) {
  const steps = ['Registration', 'Identification', 'Verification', 'Agreement']
  const { activeStep, setStep } = useSteps({
    initialStep: -1,
  })
  useEffect(() => {
    if (status && activeStep == -1) setStep(ApplicationStatus[status])
  }, [activeStep, setStep, status])
  return (
    <>
      <Show above="md">
        <Steps
          activeStep={activeStep}
          my={8}
          colorScheme={'primary'}
          color={'white'}
          responsive={false}
        >
          {steps.map((step, index) => (
            <Step key={index} color={'white'} label={step} />
          ))}
        </Steps>
      </Show>
      <Hide above="md">
        <Steps
          activeStep={activeStep}
          my={8}
          colorScheme="primary"
          color="white"
          responsive={false}
        >
          {steps.map((step, index) => (
            <Step key={index} color={'white'} title={step} />
          ))}
        </Steps>
      </Hide>
    </>
  )
}
