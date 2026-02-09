import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import GateTrackingSystem from "./GateTrackingSystem";

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!user) return <p className="text-center">Please sign in</p>;

  return <GateTrackingSystem />;
}
