import { tw } from 'twind'

export default function Custom500() {
  return  <section className={tw`bg-gray-900`}>
    <div className={tw`py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6`}>
        <div className={tw`mx-auto max-w-screen-sm text-center`}>
            <h1 className={tw`mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl `}>500</h1>
            <p className={tw`mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white`}>Internal Server Error.</p>
            <p className={tw`mb-4 text-lg font-light text-gray-500 dark:text-gray-400`}>We are already working to solve the problem. </p>
        </div>   
    </div>
</section>
}