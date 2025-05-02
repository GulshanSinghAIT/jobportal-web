import { SignUp } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
    <SignUp
     appearance={{
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold",
          card: "shadow-none",
        },
        variables: {
          colorPrimary: "#4f46e5",
        },
      }} />
    </div>
  )
}

export default Signin
