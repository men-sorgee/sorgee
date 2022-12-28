import { Steps } from 'react-daisyui'
import { ApplicationStatus } from 'lib/models'

export default function ApplicationSteps({ status }: { status: string }) {
  const steps = ['Authentication', 'Registration', 'Identification', 'Verification', 'Agreement']
  return (
    <Steps horizontal className="mt-8 w-full">
      {steps.map((step, index) => (
        <Steps.Step
          color={ApplicationStatus[status] >= index ? 'primary' : 'ghost'}
          title={step}
          key={index}
        />
      ))}
    </Steps>
  )
}
