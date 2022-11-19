import { animation, tw } from 'twind/css';

function Loading({ color = '#000' }: { color: string }) {
  function loadingStyles(delay = 0) {
    return {
      animationDuration: `2s`,
      animationIterationCount: 'infinite',
      animationFillMode: 'both',
      animationDelay: `${delay}s`,
      '@apply': 'w-5 h-5 rounded-[50%] my-0 mx-[1px] inline-block'
    };
  }

  const loadingFrames = {
    '0%': {
      opacity: 0.2
    },
    '20%': {
      opacity: 1
    },
    '100%': {
      opacity: 0.2
    }
  };

  const loading1 = animation(loadingStyles(), loadingFrames);
  const loading2 = animation(loadingStyles(0.2), loadingFrames);
  const loading3 = animation(loadingStyles(0.4), loadingFrames);
  return (
    <span className={tw`flex-inline items-center`}>
      <span className={tw(loading1)} style={{ backgroundColor: color }} />
      <span className={tw(loading1)} style={{ backgroundColor: color }} />
      <span className={tw(loading2)} style={{ backgroundColor: color }} />
    </span>
  );
}

export default Loading;
