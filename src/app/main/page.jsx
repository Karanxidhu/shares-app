"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'

function Home() {
    const router = useRouter()
    const handleSubmit = async (e) => {
        try {
            const response = await fetch('http://128.199.28.127/api/message/add', {
                method: "POST",
                headers: {
                    "token": localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text })
            })
            const data = await response.json()
            // console.log(data)
            if (!data.error) {
                setMessages([...messages, { message: data.message }])
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!(token == "sharesallowed")) {
            router.push('/login', { scroll: false })
        } else {
            getData()
        }
    }, [])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [text, setText] = useState(null);

    const getData = async () => {
        setLoading(true);
        const response = await fetch('http://128.199.28.127/api/message/getall', {
            method: "get",
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        const data = await response.json()
        setMessages(data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        const response = await fetch('http://128.199.28.127/api/message/delete/' + id, {
            method: "post",
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        const data = await response.json()
        console.log(data)
        location.reload();
    }

    const something=(event)=> {
        if (event.keyCode === 13) {
            handleSubmit();
            event.target.value=''
        }}

    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-12 md:p-24 bg-zinc-950'>
            {
                !loading && <div className='relative w-full lg:w-[75%] md:w-[85%] xl:w-[45%] border p-3 rounded-xl flex flex-wrap items-center'>
                    <div className='flex space-x-2 items-center justify-center w-full py-4'>
                        <img src="arrow.png" className='h-8 sm:h-14' alt="" />
                        <h1 className="scroll-m-20 text-2xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl mx-auto py-4">
                            Notes Niqqers
                        </h1>
                        <img src="arrow.png" className='h-8 sm:h-14' alt="" />
                    </div>
                    <div className='flex flex-wrap items-center w-full gap-3'>
                        {
                            messages && messages.map((item, key) => {
                                return (
                                    <div  key={key} className='flex px-2 space-x-2 bg-zinc-900 border rounded-lg items-center justify-around'>
                                        <span  className='text-sm sm:text-lg py-3 pl-3'>{item.message}</span>
                                        <img src="cross.png" className=' h-5 p-1 rounded-full bg-zinc-950 ' onClick={() => {
                                            handleDelete(item._id)
                                        }} alt="" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='pt-5 w-full flex items-center gap-3 justify-around mx-auto'>
                        <Input type="email" placeholder="Add Text" className='w-full text-center h-12 text-sm sm:text-lg font-bold' onChange={(e) => {
                            setText(e.target.value)
                        }} 
                        onKeyDown={(e) => something(e) } 
                        />
                        <Button variant='default' className='h-10' onClick={handleSubmit}>Send</Button>
                        
                    </div>
                    <div className='flex justify-center items-center w-full mt-5 space-x-1 hover:cursor-pointer'
                    onClick={()=>{
                        router.push('/files')
                    }}
                    >
                        <Link/>
                        <p className='font-bold text-sm sm:text-base'> continue with files </p>
                        <Link/>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home