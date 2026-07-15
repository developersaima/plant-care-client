import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

const MainLayout = ({children}:{children:React.ReactNode}) => {
    
 
  return (
    <body>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </body>
  )
}

export default MainLayout