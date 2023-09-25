import { gaEvent } from "lib/utils";
import { useReportWebVitals } from "next/web-vitals";

export default function ReportWebVitals() {
  useReportWebVitals(metric => {
    gaEvent({
      action: metric.name,
      category: 'web_vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
      label: metric.id, // id unique to current page load
      non_interaction: true, // avoids affecting bounce rate.
    });
  })

  return <></>
}
