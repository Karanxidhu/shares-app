"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

function Login() {
  const router = useRouter()
  const [code, setCode] = useState(null);
  const [alert, setAlert] = useState(false)
  const handleSubmit = async () => {
    try {
      const response = await fetch('https://sharesb.karanxd.xyz/api/auth/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code }),
      })
      const data = await response.json()
      console.log(data.token)
      localStorage.setItem('token', data.token);
      if (data.error) {
        setAlert(true)
        setTimeout(()=>{
          setAlert(false)
        },3000).then(()=>{
          router.push('/main', { scroll: false })
        })
      }else{
        router.push('/main', { scroll: false })
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  const something=(event)=> {
    if (event.keyCode === 13) {
        handleSubmit();
        event.target.value=''
    }}
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-7 sm:p-12 md:p-24 bg-zinc-950'>

      <div className='w-full lg:w-[75%] md:w-[85%] xl:w-[45%]  border px-5 py-4 sm:py-8 rounded-2xl flex flex-col justify-center items-center'>
      {alert&&<Alert className='mb-5'>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Auth error</AlertTitle>
        <AlertDescription>
          Dont fuck with it niqqa enter correct code
        </AlertDescription>
      </Alert>}
        <h1 className="scroll-m-20 text-2xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          Authorize
        </h1>
        <h2 className="scroll-m-20 border-y pb-3 py-2 mt-6 md:mt-16 text-xl md:text-3xl font-semibold tracking-tight first:mt-0 text-center">
          enter the code
        </h2>
        <div className='flex justify-center items-center mt-10 space-x-5'>
          <Input type="password" placeholder="Code" className='w-1/2 sm:w-[30%] text-center h-12 text-base sm:text-lg font-bold' onChange={(e) => {
            setCode(e.target.value) 
          }}
          onKeyDown={(e) => something(e) }
          />
          <Button variant='default' className='h-10' onClick={handleSubmit}>Verify</Button>
        </div>
      </div>
    </div>
  )
}

export default Login
