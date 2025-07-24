import { IoMailOutline, IoLockClosedOutline } from "react-icons/io5";

export default function AuthForm({ fmInput, setFmInput, handleSubmit, title }) {
  return (
    <>
      <form onSubmit={handleSubmit} className="text-center text-white">
        
        {/* Email Input */}
        <div className="authInputDiv mt-4 mb-2">
          <IoMailOutline className="authInputicon" />
          <input
            type="email"
            className="authInputField"
            placeholder="Email"
            value={fmInput.email}
            onChange={(e) =>
              setFmInput((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        {/* Password Input */}
        <div className="authInputDiv mt-2 mb-6">
          <IoLockClosedOutline className="authInputicon" />
          <input
            type="password"
            className="authInputField"
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
