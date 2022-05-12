import React, { Fragment, useState } from "react"

import { Dialog, Transition } from "@headlessui/react"
import { InjectedConnector } from "@wagmi/core"
import clsx from "clsx"
import { getCsrfToken, signIn, signOut } from "next-auth/react"
import { toast } from "react-toastify"
import { SiweMessage } from "siwe"
import {
  BrandDiscord,
  BrandTwitter,
  Check,
  Loader,
  Plus,
  Unlink,
  Wallet,
} from "tabler-icons-react"
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi"

export function ConnectAccountsModal({
  open,
  setOpen,
  loading,
  user,
  checkTwitter,
}) {
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { signMessageAsync } = useSignMessage()
  const network = useNetwork()
  const { data } = useAccount()

  const [twitterUsername, setTwitterUsername] = useState("")
  const [twitterCheckInitiated, setTwitterCheckInitiated] = useState(false)

  const connectedProfiles = {
    twitter: !!user?.accounts?.find((a) => a.provider === "twitter_custom"),
    discord: !!user?.accounts?.find((a) => a.provider === "discord"),
    wallet:
      user?.walletAddress ||
      !!user?.accounts?.find((a) => a.provider === "ethereum"),
  }

  const handleLogin = async () => {
    await connect()
    try {
      const callbackUrl = "/protected"

      const message = new SiweMessage({
        domain: window.location.host,
        address: data?.address,
        statement: "Sign in with Ethereum to the app. User ID: " + user?.id,
        uri: window.location.origin,
        version: "1",
        chainId: network.activeChain?.id,
        nonce: await getCsrfToken(),
      })

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
        userId: user?.id,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const modalButtons = [
    {
      icon: <Wallet />,
      label: "Wallet",
      completed: connectedProfiles.wallet,
      onClick: () => {
        handleLogin()
      },
    },
    {
      icon: <BrandDiscord />,
      label: "Discord",
      completed: connectedProfiles.discord,
      onClick: () => signIn("discord"),
    },
    // {
    //   icon: <BrandTwitter />,
    //   label: "Twitter v2",
    //   completed: connectedProfiles.twitter,
    //   onClick: () => signIn("twitter"),
    // },
    {
      icon: <BrandTwitter />,
      label: "Twitter",
      completed: connectedProfiles.twitter,
      onClick: () => {
        setTwitterCheckInitiated(true)
        const magicWord = "I am a robot."
        const message = encodeURIComponent(
          `Verifying my identity on @narcissanetwork: ${magicWord}`
        )
        window.open(
          `https://twitter.com/intent/tweet?text=${message}`,
          "_blank"
        )
      },
    },
  ]

  const checkTwitterIdentity = !connectedProfiles.twitter && (
    <div className="mt-4 flex items-center space-x-2">
      <input
        className="rounded-lg px-2 py-2 text-sm"
        type="text"
        placeholder="Your Twitter name"
        value={twitterUsername}
        onChange={(e) => setTwitterUsername(e.target.value)}
      />
      <button
        onClick={() => {
          if (user?.walletAddress) {
            checkTwitter({
              magicWord: "I am a robot.",
              username: twitterUsername,
            }).catch((e) => {
              toast(e.message, { type: "error" })
            })
          } else {
            alert("You need to connect your wallet first.")
          }
        }}
        className="btn-primary py-1 px-4"
      >
        Check
      </button>
    </div>
  )

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mt-2">
                  <p className="text-2xl leading-6 sm:text-4xl">
                    Link your social profiles to claim associated rewards
                  </p>
                </div>

                <div className="mt-4 space-y-4">
                  {modalButtons.map((btn) => (
                    <div
                      className="flex items-center space-x-4"
                      key={btn.label}
                    >
                      <button
                        onClick={btn.onClick}
                        className={clsx(
                          "btn-primary w-32 border py-1 tracking-widest",
                          btn.completed
                            ? "border-black bg-purple-300"
                            : "border-purple-600 bg-transparent"
                        )}
                      >
                        {btn.icon}
                        <p>{btn.label}</p>
                      </button>

                      {loading && <Loader className="animate-spin" />}

                      {!loading &&
                        (btn.completed ? (
                          <div className="flex items-center space-x-2">
                            <Check className="text-green-600" strokeWidth={4} />

                            <div title="Disconnect" onClick={btn.onClick}>
                              <Unlink className="cursor-pointer" />
                            </div>
                          </div>
                        ) : (
                          <Plus
                            className="rotate-45 text-red-600"
                            strokeWidth={4}
                          />
                        ))}
                    </div>
                  ))}
                </div>

                {checkTwitterIdentity}

                <div className="mt-8 flex justify-end space-x-6">
                  <button
                    type="button"
                    className="btn-outlined"
                    onClick={() => {
                      signOut()
                      setOpen(false)
                    }}
                  >
                    Sign Out
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
