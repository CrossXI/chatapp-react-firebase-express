import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function AuthForm({ fmInput, setFmInput, handleSubmit, title }) {
  return (
    <>
      <form onSubmit={handleSubmit} className="text-center text-white">
        
        {/* Email Input */}
        <div className="input border bg-gray-800 border-gray-600 rounded px-3 py-2 mt-4 mb-2">
          <IoMailOutline className="text-lg mr-2 text-gray-400" />
          <input
            type="email"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            placeholder="Email"
            value={fmInput.email}
            onChange={(e) =>
              setFmInput((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        {/* Password Input */}
        <div className="input border bg-gray-800 border-gray-600 rounded px-3 py-2 mt-2 mb-6">
          <IoLockClosedOutline className="text-lg mr-2 text-gray-400" />
          <input
            type="password"
            className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
            placeholder="Password"
            value={fmInput.password}
            onChange={(e) =>
              setFmInput((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="btn btn-soft btn-warning">
            {title}
          </button>
        </div>
      </form>
    </>
  );
}
