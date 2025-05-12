import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/user.atom';
import { pointsAtom } from '../store/points.atom';
import { badgeConstrain } from '../constrains/badge.constrain';

const Profile = () => {
  const user = useRecoilValue(userAtom);
  const points = useRecoilValue(pointsAtom);
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    let foundBadge = null;
    for (let i = badgeConstrain.length - 1; i >= 0; i--) {
      if (points >= badgeConstrain[i].score) {
        foundBadge = badgeConstrain[i];
        break;
      }
    }
    if(foundBadge) {
      setBadge(foundBadge);
    }
  }, [points]); 

  return (
    <div className="bg-black w-full mx-auto rounded-xl text-white mb-6 py-6 px-4 sm:px-10 sm:py-10">
      {user ? (
        <div className="flex justify-between items-center flex-col lg:flex-row">
          <div className="flex items-center flex-col lg:flex-row gap-4">
            <img
              src={user.photoURL}
              alt={`${user.name}'s profile`}
              className="rounded-full w-20 lg:w-28"
            />
            <div className="text-center lg:text-start">
              <p className="text-lg lg:text-3xl font-bold">
                {user.name} [<span className="text-md lg:text-2xl text-primary_orange-0">@{user.githubId}</span>]
              </p>
              <p className="text-sm lg:text-xl">{user.email}</p>
              <p className="font-semibold">
                Contributor <span className="text-primary_orange-0">GSSoC&apos;24</span>
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-2">
                <Link href={`https://github.com/${user.githubId}`} target="_blank">
                  <img src="./github.svg" alt="GitHub profile" className="w-10" />
                </Link>
                {badge && (
                  <img src={badge.badge} alt={`${badge.name} badge`} className="lg:hidden w-[3.2rem] cursor-pointer" />
                )}
              </div>
            </div>
          </div>
          {badge ? (
            <div className="hidden lg:flex flex-col items-center mt-4 lg:mr-4">
              <img src={badge.badge} alt={`${badge.name} badge`} className="w-20 cursor-pointer" />
              <p className="font-semibold text-primary_orange-0">{badge.name}</p>
            </div>
          )
            :
            (
              <div className='mt-2 lg:mt-0'>
                <p>Earn at least 65 points to get a badge</p>
              </div>
            )}
        </div>
      ) : (
        <div>
          <h2 className="font-semibold text-2xl text-primary_orange-0">Login to see your profile</h2>
        </div>
      )}
    </div>
  );
};

export default Profile;