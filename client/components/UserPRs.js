import { IoGitPullRequest } from "react-icons/io5";
import { GoGitPullRequestClosed } from "react-icons/go";
import { FaProjectDiagram } from "react-icons/fa";
import { PiGitMergeDuotone } from "react-icons/pi";
import Link from "next/link";

const Badge = ({ children, className }) => (
    <div className={`px-4 py-3 rounded-lg ${className}`}>
        {children}
    </div>
);

const UserPRs = ({ pull }) => {

    const getPoints = (label) => {
        if (label.includes("level1")) return 10;
        if (label.includes("level2")) return 25;
        if (label.includes("level3")) return 45;
        return 0;
    };

    const statusBadge = pull.status === "merged"
        ? <Badge className="bg-purple-500 text-white flex gap-1 items-center"><PiGitMergeDuotone /><span>{pull.status}</span></Badge>
        : pull.status === "open"
            ? <Badge className="bg-green-500 text-white flex gap-1 items-center"><IoGitPullRequest /><span>{pull.status}</span></Badge>
            : <Badge className="bg-red-500 text-white flex gap-1 items-center"><GoGitPullRequestClosed /><span>{pull.status}</span></Badge>;

    const points = getPoints(pull.labels);
    const pointsBadge = (
        <Badge className={`${points === 0 ? "bg-red-400" : points === 10 ? "bg-[#00BCD4]" : points === 25 ? "bg-[#1ABC9C]" : "bg-[#4CAF50]"} text-white`}>
            <span>{points} Points</span>
        </Badge>
    );

    const labelColors = {
        "gssoc": "bg-[#ff7919]",
        "level1": "bg-[#00BCD4]",
        "level2": "bg-[#1ABC9C]",
        "level3": "bg-[#4CAF50]"
    };

    return (
        <div className="flex flex-col items-center sm:flex-row gap-6 lg:gap-8 w-full border-2 border-[#ff79193a] p-4 lg:p-6 rounded-md mb-6 shadow-md shadow-[#ff7919aa] hover:shadow-lg hover:shadow-[#ff791999]">
            <div className="flex flex-wrap justify-center sm:flex-col gap-3">
                {statusBadge}
                {pointsBadge}
            </div>
            <div className="flex flex-col gap-3 w-fit items-center sm:items-start">
                <h1 className="font-semibold text-[1.1rem] lg:text-[1.4rem] dark:text-white">
                    <FaProjectDiagram className="inline-flex mr-2" />
                    Project:
                    <a href={pull.projectURL} target="_blank">
                        <span className="text-primary_orange-0 hover:underline cursor-pointer"> {pull.project}</span>
                    </a>
                </h1>
                <h2 className="font-bold text-[1.3rem] lg:text-[1.6rem] dark:text-white">{pull.title}</h2>
                <div className="flex flex-wrap gap-2">
                    {pull.labels.map((label, index) => (
                        <div key={index} className={`${labelColors[label] || "bg-[#aeadadae]"} text-sm rounded-3xl py-1 px-2`}>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>
                <a href={pull.pullURL} className="py-2 w-fit" target="_blank">
                    <span className="w-fit bg-primary_orange-0 text-white rounded-md px-4 py-3 hover:bg-slate-800 transition duration-300">View on Github</span>
                </a>
                <p className="dark:text-white text-[0.9rem] lg:text-base">
                    {pull.status === "merged"
                        ? `Your PR is merged. Congratulations on your ${points} points.`
                        : pull.status === "open"
                            ? `Your PR is open. Points will be awarded upon merging.`
                            : `Your PR is closed. You have earned 0 points.`}
                </p>
            </div>
        </div>
    );
}

export default UserPRs;