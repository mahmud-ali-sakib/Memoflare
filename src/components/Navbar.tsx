import { Button } from "./ui/button"

const Navbar = () => {
  return (
    <div className="flex justify-between items-center h-15 ">
      <div className=" items-center justify-center">
        <h1 className=" text-xl font-bold tracking-tight">Memoflare</h1>
      </div>
 
      <div className=" flex gap-2">
        <Button variant='secondary'>Log In</Button>
        <Button>Sign Up</Button>
      </div>
    </div>
  )
}

export default Navbar
