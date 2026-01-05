import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Account() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>

      <div className="border p-4 rounded mb-6">
        <p>
          <strong>Name:</strong> {user.displayName || "Customer"}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <button
          onClick={() => auth.signOut()}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      <Link to="/orders" className="block border p-4 rounded hover:bg-gray-50">
        View My Orders →
      </Link>
    </div>
  );
}
