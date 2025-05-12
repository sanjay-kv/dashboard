import { useEffect, useState } from "react";
import Profile from "../components/Profile";
import Scorecard from "../components/Scorecard";
import ValidatePR from "../components/ValidatePR";
import UserPRs from "../components/UserPRs";
import { useRecoilValue, useRecoilState } from "recoil";
import { userAtom } from "../store/user.atom";
import { AllPRsAtom } from "../store/allPRs.atom";

const Dashboard = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const user = useRecoilValue(userAtom);
  const [pulls, setPulls] = useRecoilState(AllPRsAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/v1/pull/details/${user.githubId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setPulls(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(error.message);
          setLoading(false);
        });
    }
  }, [user, setPulls, BACKEND_URL]);

  return (
    <section className="px-6">
      <Profile />
      <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-16 mb-10">
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 lg:order-2 lg:gap-8 w-full lg:w-[40rem]">
          <Scorecard />
          <ValidatePR />
        </div>
        <div className="w-full lg:order-1 shadow-2xl px-2 py-6 lg:py-8 min-h-[65vh]">
          <h2
            className={`text-2xl lg:text-3xl font-bold mb-4 ${
              user ? "text-center dark:text-white" : "text-primary_orange-0"
            }`}
          >
            Your Pull Requests
          </h2>
          {user ? (
            <div className="h-full max-h-[80vh] overflow-y-scroll scroll-smooth px-4">
              {loading ? (
                <p className="text-center text-lg">Loading...</p>
              ) : error ? (
                <p className="text-center text-lg text-red-500">{error}</p>
              ) : pulls.length === 0 ? (
                <div className="w-full border border-primary_orange-0 p-6 rounded-md">
                  <p className="text-black dark:text-white text-center text-xl lg:text-2xl">
                    You don&apos;t have any pull requests!
                  </p>
                </div>
              ) : (
                pulls.map((pull, index) => <UserPRs key={index} pull={pull} />)
              )}
            </div>
          ) : (
            <div className="mt-4">
              <h2 className="font-semibold text-xl dark:text-white">
                Login to see your PRs
              </h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;