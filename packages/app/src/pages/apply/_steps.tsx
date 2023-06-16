import { useEffect } from 'react'

import { Step, Steps, useSteps } from 'chakra-ui-steps'
import { ApplicationStatus } from '@lib/models'

import { Hide, Show } from '@chakra-ui/react'

export default function ApplicationSteps({ status }: { status: string }) {
  const steps = ['Registration', 'Verification', 'Review', 'Agreement']
  const { activeStep, setStep } = useSteps({
    initialStep: 0
  })
  useEffect(() => {
    if (status && activeStep == 0) setStep(ApplicationStatus[status])
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
