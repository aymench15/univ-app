import React, { useEffect, useState } from 'react'
import { token } from '../config'

const useFecthReview = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(()  => {
        const fetchData = async () => {
            
            setLoading(true)

            try {
                console.log("url is : ",url)
                const res = await fetch(url)
                
    
                const result = await res.json();
                console.log("result from here review :: ",result)
    
                if(!res.ok) {
                    throw new Error(result.message + 'error')
                }    

                setData(result)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                setError(err.message)
                console.error('Fetch Error:', err);
            }  
         }
         fetchData()
    }, [url])

  return {
    data,
    loading,
    error
  }
}

export default useFecthReview