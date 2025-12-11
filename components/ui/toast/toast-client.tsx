"use client"

import { Toaster, ToastBar } from "react-hot-toast"

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      containerStyle={{
        background: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
      containerClassName="!bg-transparent"
      toastOptions={{
        className: "!bg-white !text-gray-900 border border-gray-200 shadow-lg",
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#111827",
        },
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            animation: t.visible
              ? "toast-in 0.4s ease forwards"
              : "toast-out 0.4s ease forwards",
            fontSize: "15px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        />
      )}
    </Toaster>
  )
}