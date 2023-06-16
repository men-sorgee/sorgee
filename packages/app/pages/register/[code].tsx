import RegisterPage, { getServerSideProps as pageProps } from './index'

export async function getServerSideProps({ params }) {
  const {
    props: { birthMonthOptions },
  } = await pageProps()
  const { findPromo } = await import('lib/services/directus/server')
  const { code } = params
  if (!code) return { props: { birthMonthOptions } }

  const promo = await findPromo(code)
  if (!promo) return { props: { birthMonthOptions } }

  return {
    props: {
      promo,
      birthMonthOptions,
    },
  }
}

export default RegisterPage
