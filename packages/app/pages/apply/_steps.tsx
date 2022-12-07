import { Steps } from 'react-daisyui';
import { ApplicationStatus } from 'lib/services/directus';

export default function ApplicationSteps({ status }: { status: string }) {
  const steps = [
    'Authentication',
    'Registration',
    'Identification',
    'Verification',
    'Agreement'
  ];
  return (
    <Steps horizontal className="w-full">
      {steps.map((step, index) => (
        <Steps.Step
          color={ApplicationStatus[status] >= index ? 'primary' : 'ghost'}
          title={step}
          key={index}
        />
      ))}
    </Steps>
  );
}
