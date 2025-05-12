import { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { userAtom } from "../store/user.atom";
import { pointsAtom } from "../store/points.atom";
import { AllPRsAtom } from '../store/allPRs.atom';
import { Level1Atom, Level2Atom, Level3Atom } from '../store/levels.atom';

const Scorecard = () => {
    const user = useRecoilValue(userAtom);
    const [points, setPoints] = useRecoilState(pointsAtom);
    const pulls = useRecoilValue(AllPRsAtom);
    const [level1, setLevel1] = useRecoilState(Level1Atom);
    const [level2, setLevel2] = useRecoilState(Level2Atom);
    const [level3, setLevel3] = useRecoilState(Level3Atom);

    useEffect(() => {
        setLevel1(pulls.filter(pull => pull.labels.includes("level1")).length);
        setLevel2(pulls.filter(pull => pull.labels.includes("level2")).length);
        setLevel3(pulls.filter(pull => pull.labels.includes("level3")).length);
    }, [pulls, setLevel1, setLevel2, setLevel3]);

    useEffect(() => {
        setPoints((level1 * 10) + (level2 * 25) + (level3 * 45));
    }, [level1, level2, level3, setPoints]);

    return (
        <div className="bg-black p-6 rounded-xl w-full">
            <h1 className="text-primary_orange-0 font-semibold">SCORECARD</h1>
            {user ? (
                <>
                    <div className="my-4">
                        {/* <div className="text-white flex items-center text-2xl">
                            <h2 className="font-bold">Rank : <span className="text-primary_orange-0">11</span></h2>
                        </div> */}
                        <div className="text-white flex items-center text-2xl">
                            <h2 className="font-bold">Total Points : <span className="text-primary_orange-0">{points}</span></h2>
                        </div>
                        <div className="text-white flex items-center text-2xl">
                            <h2 className="font-bold">Total PRs : <span className="text-primary_orange-0">{pulls.length}</span></h2>
                        </div>
                    </div>
                    <div className="text-[#c4c4c4ff] font-semibold">
                        {[
                            { label: "Level1", value: level1 },
                            { label: "Level2", value: level2 },
                            { label: "Level3", value: level3 }
                        ].map(({ label, value }) => (
                            <p key={label}>No of {label} PR : <span className="text-primary_orange-0">{value}</span></p>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-white mt-4">
                    <h2 className="font-semibold text-xl">Login to see your scorecard</h2>
                </div>
            )}
        </div>
    );
};

export default Scorecard;
