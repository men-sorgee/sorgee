import { default as SurveyPage } from './index'
import { useRouter } from 'next/router'
export default function PagedSurveyPage() {
  const router = useRouter()
  const { step: s = 0 } = router.query
  const step = Number(s)
  return <SurveyPage step={step} />
}
