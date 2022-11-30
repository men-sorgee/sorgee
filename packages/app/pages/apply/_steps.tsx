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
  return (
    <Steps horizontal className="w-full">
      <Steps.Step color={'primary'} title="Authentication"></Steps.Step>
      <Steps.Step
        color={value >= 0 ? 'primary' : 'ghost'}
        title="Registration"
      ></Steps.Step>
      <Steps.Step
        color={value >= 1 ? 'primary' : 'ghost'}
        title="Identification"
      ></Steps.Step>
      <Steps.Step
        color={value >= 2 ? 'primary' : 'ghost'}
        title="Verification"
      ></Steps.Step>
      <Steps.Step
        color={value >= 3 ? 'primary' : 'ghost'}
        title="Indemnification"
      ></Steps.Step>
    </Steps>
  );
}
