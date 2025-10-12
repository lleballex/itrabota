import axios_ from "axios"

export const axios = axios_.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})
