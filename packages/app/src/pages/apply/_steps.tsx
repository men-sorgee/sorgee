
import { ApplicationStatus } from "lib/models";
import { useEffect } from "react";

import {
  Heading,
  Show,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps
} from "@chakra-ui/react";

export default function ApplicationSteps({ status }: { status: string }) {
  const steps = ['Application', 'Verification', 'Wait for Review', 'Agreement']
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,

  })
  useEffect(() => {
    if (status && activeStep == 0) setActiveStep(ApplicationStatus[status])
  }, [activeStep, setActiveStep, status])
  return (
    <>

      <Stepper
        index={activeStep}
        my={8}
        mr={4}
        colorScheme={'primary'}
        color={'white'}

      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator title={step}>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Show above="md">
              <StepTitle as={Heading} size="md" my={0}>{step}</StepTitle>
            </Show>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>


    </>
  )
}
