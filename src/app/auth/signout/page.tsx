import { AuthButton } from '@/components/Buttons/AuthButton'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

export default function page() {
  return (
    <DefaultLayout>
        <div className="mb-5">
            <AuthButton
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            authButtonText='Sign Out'
            />
        </div>
    </DefaultLayout>
  )
}
