import React, { Fragment, useEffect, useState } from "react"

import { httpBatchLink } from "@trpc/client/links/httpBatchLink"
import { loggerLink } from "@trpc/client/links/loggerLink"
import { withTRPC } from "@trpc/next"
import { Devtools } from "@ui-devtools/tailwind"
import { AnimatePresence } from "framer-motion"
import mixpanel from "mixpanel-browser"
import "../styles/tailwind.scss"
import "react-toastify/dist/ReactToastify.css"
import { Router, useRouter } from "next/router"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { ToastContainer } from "react-toastify"
import superjson from "superjson"
import { createClient, Provider as WagmiProvider } from "wagmi"

import { AppRouter } from "@backend/router"
import AppShell from "@shared/client/components/Layout/AppShell"
import PageLoader from "@shared/client/components/Layout/PageLoader"

const client = createClient({ autoConnect: true })

function MyApp({ Component, pageProps }): JSX.Element {
  const router = useRouter()
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: Number.POSITIVE_INFINITY },
        },
      })
  )

  const [loading, setLoading] = useState(false)
  const [route, setRoute] = useState("")

  useEffect(() => {
    const start = (e: string) => {
      setLoading(true)
      setRoute(e)
      mixpanel.track("page_view", {
        url: e,
      })
    }
    const end = () => {
      setLoading(false)
      setRoute("")
    }

    Router.events.on("routeChangeStart", start)
    Router.events.on("routeChangeComplete", end)
    Router.events.on("routeChangeError", end)
    return () => {
      Router.events.off("routeChangeStart", start)
      Router.events.off("routeChangeComplete", end)
      Router.events.off("routeChangeError", end)
    }
  }, [])

  return (
    <Devtools>
      <WagmiProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydrateState}>
            <AppShell>
              <AnimatePresence
                exitBeforeEnter
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}
              >
                <Fragment key={route}>
                  <Component {...pageProps} key={router.asPath} />

                  {process.env.NODE_ENV === "development" && (
                    <ReactQueryDevtools initialIsOpen={false} />
                  )}
                </Fragment>
              </AnimatePresence>

              <ToastContainer />
            </AppShell>

            <AnimatePresence>
              {/* TODO: this seems to be broken, fix this later */}
              <PageLoader loading={loading} route={route} />
            </AnimatePresence>
          </Hydrate>
        </QueryClientProvider>
      </WagmiProvider>
    </Devtools>
  )
}

// export default MyApp

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://app.narcissa.xyz`

export default withTRPC<AppRouter>({
  config({ ctx }) {
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */

  responseMeta({ clientErrors }) {
    if (clientErrors.length) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      }
    }
    return {}
  },

  ssr: true,
})(MyApp)
