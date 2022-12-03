import { Steps } from 'react-daisyui';
import {
  ApplicationStatusType,
  getApplicationStatusIndex
} from 'lib/services/directus';

export default function ApplicationSteps({
  status
}: {
  status?: ApplicationStatusType;
}) {
  const value = getApplicationStatusIndex(status);
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
          color={value >= index ? 'primary' : 'ghost'}
          title={step}
          key={index}
        />
      ))}
    </Steps>
  );
}
