"use client"
import React, { use, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import download from "downloadjs";
import { useRouter } from 'next/navigation'
import { Link } from 'lucide-react'

function Files() {

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!(token == "sharesallowed")) {
      router.push('/login', { scroll: false })
    } else {
      fetchFiles()
    }
  }, [])
  const router = useRouter()

  const fetchFiles = async () => {
    setLoading(true);
    const response = await fetch('http://128.199.28.127/api/message/files', {
      method: 'get',
      headers: {
        "token": localStorage.getItem('token')
      }
    })
    const data = await response.json()
    setFiles(data)
    console.log(data)
    setLoading(false)

  }
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState()
  const [files, setFiles] = useState([])

  const submit = async (event) => {
    const formData = new FormData()
    formData.append("fileUp", file)
    const result = await axios.post('http://128.199.28.127/api/message/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    console.log(result)
    location.reload();
  }

  const handleDownload = async (key) => {
    const res = await fetch("http://128.199.28.127/api/message/download", {
      method: 'post',
      headers: {
        "token": localStorage.getItem('token'),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: files[key] }),
    });
    const blob = await res.blob();
    download(blob);
  }

  const handleDelete = async (key) => {
    const response = await fetch('http://128.199.28.127/api/message/deletefile', {
        method: "post",
        headers: {
            "token": localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name:  files[key]}),
      })
    // const data = await response.json()
    // console.log(data)
    location.reload();
}

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950'>
      {
        !loading && <div className=' w-full lg:w-[75%] md:w-[85%] xl:w-[45%] border p-3 rounded-xl flex flex-wrap items-center gap-5'>

          {
            files.map((item, key) => {
              return (
                <div key={key} className='p-5 pb-4 bg-[#ffffff09] rounded-2xl flex justify-center items-center flex-col'
                  
                >
                  <div className='flex items-center gap-5'>
                    <img src="file.png" className='h-20' alt="" onClick={() => {
                    handleDownload(key)
                  }} />
                    <img src="cross.png" className=' h-6 p-1 rounded-full bg-zinc-950 ' alt=""
                    onClick={()=>{
                      handleDelete(key)
                    }}
                    />
                  </div>

                  <p className='text-center pt-2 font-semibold' onClick={() => {
                    handleDownload(key)
                  }}>{item.slice(23, item.length)}</p>
                </div>
              )
            })
          }

          <div className='pt-5 w-full flex items-center gap-5 justify-around mx-auto'>
            <Input id="picture" type="file" className='h-12 pt-3'
              onChange={e => {
                setFile(e.target.files[0])
                console.log(file)
              }
              }
              accept="*.*"
            />
            <Button variant='default' className='h-10' onClick={submit}>Send</Button>
          </div>
          <div className='flex justify-center items-center w-full space-x-1 hover:cursor-pointer'
            onClick={() => {
              router.push('/main')
            }}
          >
            <Link />
            <p className='font-bold'> continue with text </p>
            <Link />
          </div>
        </div>
      }
    </div>
  )
}

export default Files