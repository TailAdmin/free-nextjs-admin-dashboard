import ECommerce from '@/components/Dashboard/E-commerce';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import React from 'react'

export default function page() {
  return (
    <main className="min-h-screen bg-black">
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </main>
  );}
