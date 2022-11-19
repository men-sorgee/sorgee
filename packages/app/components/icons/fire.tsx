import { animation, tw } from 'twind/css';

function flameStyles(duration = 3, delay = 0) {
  return {
    animationDuration: `${duration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDelay: `${delay}s`
  };
}
const flameFrames = {
  '50%': {
    transform: `scale(1, 1.2) translate(0, -30px) rotate(-2deg)`
  }
};
const flame = animation(flameStyles(3), flameFrames);
const flame1 = animation(flameStyles(3, 1), flameFrames);
const flame2 = animation(flameStyles(3, 2), flameFrames);
const flame3 = animation(flameStyles(2.1, 3), flameFrames);
const flame4 = animation(flameStyles(3.2, 4), flameFrames);
const flame5 = animation(flameStyles(2.5, 5), flameFrames);

function sparkStyles(duration = 2, delay = 0) {
  return {
    animationDuration: `${duration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationDelay: `${delay}s`,
    opacity: 0,
    transformOrigin: '50% 50% 0'
  };
}
const sparkFrames = {
  '0%': {
    transform: `translate(0) rotate(180deg)`
  },
  '50%': {
    opacity: 1
  },
  '100%': {
    transform: `translate(-20px, -100px) rotate(180deg)`,
    opacity: 0
  }
};

const spark = animation(sparkStyles(), sparkFrames);
const spark1 = animation(sparkStyles(1, 3), sparkFrames);
const spark2 = animation(sparkStyles(5, 1), sparkFrames);

export default function FireIcon() {
  return (
    <div className={tw`w-1/3 max-w-sm h-auto my-0 mx-0 md:mx-auto`}>
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        height="189.864px"
        viewBox="0 0 125 189.864"
        enableBackground="new 0 0 125 189.864"
        className={tw`w-full h-auto max-w-sm`}
      >
        <path
          className={tw(flame)}
          fill="#F36E21"
          d="M76.553,186.09c0,0-10.178-2.976-15.325-8.226s-9.278-16.82-9.278-16.82s-0.241-6.647-4.136-18.465
c0,0,3.357,4.969,5.103,9.938c0,0-5.305-21.086,1.712-30.418c7.017-9.333,0.571-35.654-2.25-37.534c0,0,13.07,5.64,19.875,47.54
c6.806,41.899,16.831,45.301,6.088,53.985"
        />
        <path
          className={tw(flame1)}
          fill="#F6891F"
          d="M61.693,122.257c4.117-15.4,12.097-14.487-11.589-60.872c0,0,32.016,10.223,52.601,63.123
c20.585,52.899-19.848,61.045-19.643,61.582c0.206,0.537-19.401-0.269-14.835-18.532S57.576,137.656,61.693,122.257z"
        />
        <path
          className={tw(flame2)}
          fill="#FFD04A"
          d="M81.657,79.192c0,0,11.549,24.845,3.626,40.02c-7.924,15.175-21.126,41.899-0.425,64.998
C84.858,184.21,125.705,150.905,81.657,79.192z"
        />
        <path
          className={tw(flame3)}
          fill="#FDBA16"
          d="M99.92,101.754c0,0-23.208,47.027-12.043,80.072c0,0,32.741-16.073,20.108-45.79
C95.354,106.319,99.92,114.108,99.92,101.754z"
        />
        <path
          className={tw(flame4)}
          fill="#F36E21"
          d="M103.143,105.917c0,0,8.927,30.753-1.043,46.868c-9.969,16.115-14.799,29.041-14.799,29.041
S134.387,164.603,103.143,105.917z"
        />
        <path
          className={tw(flame5)}
          fill="#FDBA16"
          d="M62.049,104.171c0,0-15.645,67.588,10.529,77.655C98.753,191.894,69.033,130.761,62.049,104.171z"
        />
        <path
          className={tw(spark)}
          fill="#F36E21"
          d="M101.011,112.926c0,0,8.973,10.519,4.556,16.543C99.37,129.735,106.752,117.406,101.011,112.926z"
        />
        <path
          className={tw(spark1)}
          fill="#F36E21"
          d="M55.592,126.854c0,0-3.819,13.29,2.699,16.945C64.038,141.48,55.907,132.263,55.592,126.854z"
        />
        <path
          className={tw(spark2)}
          fill="#F36E21"
          d="M54.918,104.595c0,0-3.959,6.109-1.24,8.949C56.93,113.256,52.228,107.329,54.918,104.595z"
        />
      </svg>
    </div>
  );
}
