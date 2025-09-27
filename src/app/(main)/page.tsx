"use client"

import AuthProvider from "@/components/special/AuthProvider"

const HomePageContent = () => {
  return <div>Hello world</div>
}

export default function HomePage() {
  return <AuthProvider Component={HomePageContent} />
}
