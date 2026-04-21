import Link from 'next/link'
   import Image from 'next/image'
export default function Navbar() {
  return (

    <nav className="bg-white shadow-md">
<div className="flex items-center gap-2">
  <Image
    src="/logo.png"
    alt="EventApp logo"
    width={120}
    height={80}
  />
 
</div>
      
    </nav>
  )
}