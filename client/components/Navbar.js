import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Tooltip } from "@chakra-ui/react";
import { navbarConstrain } from "../constrains/navbar.constrain";
import MoreMenu from "./MoreMenu";
import ThemeChanger from "./Toggler";
import { useRecoilState } from "recoil";
import { userAtom } from "../store/user.atom";
import { GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { FirebaseAuth } from "../auth/firebase";

export const Navbar = () => {
  const auth = FirebaseAuth;
  const githubProvider = new GithubAuthProvider();

  const [active, setActive] = useState(false);
  const [profile, setProfile] = useState(false);
  const { theme } = useTheme();
  const [user, setUser] = useRecoilState(userAtom);
  const [mounted, setMounted] = useState(false);

  const toggleProfile = () => {
    setProfile(!profile);
  };

  const handleClick = () => {
    setActive(!active);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userInfo = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          githubId: user.reloadUserInfo.screenName,
          uid: user.uid,
        };
        setUser(userInfo);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, setUser]);

  const signUpWithGithub = () => {
    signInWithPopup(auth, githubProvider).catch((error) =>
      console.error("Error during sign in:", error)
    );
  };

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="flex items-center justify-between transition-colors flex-wrap bg-white drop-shadow-xl p-1 mb-10 dark:bg-black dark:text-white dark:transition-colors sticky top-0 z-10">
      <div className="flex items-center p-1.5 ml-5">
        <Link href="/" className="inline-flex items-center">
          <span className="text-xl font-bold uppercase tracking-wide">
            <img
              src={theme === "dark" ? "./GS_logo_White.svg" : "./GS_logo_Black.svg"}
              style={{ width: "200px" }}
              id="Learn_more"
              alt="GSSoC logo light"
            />
          </span>
        </Link>
      </div>
      <button
        className="inline-flex p-2.5 hover:bg-orange-600 rounded 2xl:hidden text-grey-700 dark:text-white"
        onClick={handleClick}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className={`${active ? "" : "hidden"} w-full 2xl:inline-flex 2xl:flex-grow 2xl:w-auto text-center`}>
        <div className="flex flex-col gap-2 2xl:flex-row 2xl:ml-auto 2xl:w-auto items-center 2xl:mr-6">
          {navbarConstrain.map((link, index) => (
            <Link href={link.href} key={index}>
              <span
                onClick={handleClick}
                className="2xl:inline-flex 2xl:w-auto w-full px-2.5 py-2 text-center rounded text-grey-700 text-1xl font-medium mr-2.5 hover:text-primary_orange-0 dark:hover:text-primary_orange-0 hover:text-lg transition-all link link-underline link-underline-black"
              >
                {link.title}
              </span>
            </Link>
          ))}
          <div className="2xl:inline-flex 2xl:w-auto w-full px-2 text-center rounded">
            <MoreMenu handleClick={handleClick} />
          </div>

          {user ? (
            <div className="relative mr-4 ml-2">
              <div
                className="h-12 p-2 rounded-full bg-primary_orange-0 flex items-center justify-center gap-2 cursor-pointer"
                onClick={toggleProfile}
              >
                <img src={user.photoURL} alt="profile" className="rounded-full h-full" />
                {active && <span className="2xl:hidden">{user.name}</span>}
              </div>
              {profile && (
                <div className="w-full min-w-fit absolute 2xl:top-[3.4rem] right-0 p-4 2xl:p-6 bg-gray-800 border-[1px] border-white rounded-xl flex flex-col items-center">
                  <div className="hidden 2xl:flex gap-3 p-2 rounded-xl items-center justify-center bg-primary_orange-0 w-[15rem]">
                    <img src={user.photoURL} alt="" className="w-[4rem] rounded-full font-bold" />
                    <span className="bg-inherit font-bold text-white">{user.name}</span>
                  </div>
                  <a href={`https://github.com/${user.githubId}`} className="hidden 2xl:flex gap-3 items-center justify-center my-4">
                    <img src="./github.svg" alt="" className="w-[2rem]" />
                    <span className="text-white font-bold">{user.githubId}</span>
                  </a>
                  <button
                    onClick={() => signOut(auth)}
                    className="bg-white text-black font-bold py-2 px-4 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <span
                onClick={signUpWithGithub}
                className="text-grey-700 text-1xl font-medium mr-4 ml-2 cursor-pointer hover:text-primary_orange-0 hover:text-lg transition-all"
              >
                LOGIN
              </span>
            </div>
          )}
          <div className="hidden 2xl:block">
            <Tooltip label="Change Theme" placement="bottom">
              <div>
                <ThemeChanger />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
