import React, { useState } from "react"
import FormField from "../components/FormField";
import { Link } from "react-router-dom";

const SignupPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    
    const handleFormSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        console.log(formData.email);
        console.log(formData.password);
    };

  return (
    <div className="w-full min-h-screen shadow-2xl text-xl relative text-center py-8 flex-col-center">
        <div className="max-w-md w-full mx-auto px-4">
        <h2 className="font-semibold text-2xl mb-6">Create account</h2>

        <div className="border border-gray-300 flex flex-col align-center rounded py-6 px-4 bg-white">
          <p className="text-gray-600 mb-4">Enter details below</p>

          <form 
            onSubmit={handleFormSubmit}
            className="w-full max-w-sm space-y-4 ">

                <FormField 
                    title="Enter your organization email"
                    type="email"
                    placeholder="example@kfueit.edu.pk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                />

                <FormField
                    title="Password"
                    type="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full"
                />

                <div className="pt-4">
              <button
                type="submit"
                // disabled={loading}
                className="w-full px-6 py-3 bg-blue-400 hover:bg-opacity-90 disabled:opacity-50"
              >
                {/* {loading ? "Creating..." : "Create Account"} */}
                create
              </button>
            </div>
            </form>

            {/* ALREADY REGISTERED */}
            <div className="text-gray-500 w-full mt-6 text-center">
            <p className="flex items-center justify-center gap-1">
              Already have an account?
              <Link
                to="/login"
                className="underline flex items-center gap-1 hover:no-underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
        </div>
    </div>
  )
}

export default SignupPage