import { useEffect, useState } from 'react';
import { userAtom } from '../store/user.atom';
import { useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';
import { useTheme } from "next-themes";

const ValidatePR = () => {

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const user = useRecoilValue(userAtom);
    const { theme } = useTheme();
    const [input, setInput] = useState('');
    const [githubId, setGithubId] = useState('');
    const [loading, setLoading] = useState(false);

    const toastConfig = () => ({
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'dark' ? 'light' : 'dark',
    });


    useEffect(() => {
        if (user) {
            setGithubId(user.githubId);
        }
    }, [user]);

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    //Check basic URL validation
    const checkValidation = (url) => {

        if (!url.startsWith("https://github.com/")) {
            toast.error('Invalid GitHub pull request URL format', toastConfig());
            return;
        }

        const urlParts = url.split("/");
        const pullNumber = urlParts[6];

        const isInteger = (value) => {
            return typeof value === 'string' && /^\d+$/.test(value);
        };

        if (!isInteger(pullNumber)) {
            toast.error('Pull number must be an integer', toastConfig());
            return;
        }
        return url;
    }

    const validate = async (event) => {
        event.preventDefault();

        const URL = checkValidation(input);

        if (URL) {
            setLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/v1/pull/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pullURL: URL, githubID: githubId }),
                });

                const data = await response.json();

                if (data.success) {
                    toast.success(data.message, toastConfig());
                    window.location.reload();
                } else {
                    toast.error(data.message, toastConfig());
                }
            } catch (error) {
                toast.error('An error occurred while validating the PR.', toastConfig());
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-black text-white p-8 rounded-xl w-full h-fit">
            <h2 className={`font-bold text-xl text-center ${!user && 'text-primary_orange-0 text-start'}`}>Validate your pull requests!</h2>
            {user ? (
                <form className="flex flex-col mt-4" onSubmit={validate}>
                    <div className="border-b mb-8">
                        <span className="text-sm group-focus-within:text-black dark:group-focus-within:text-white transition-all duration-200 text-primary_orange-0">PR URL</span>
                        <input type="text" required onChange={handleChange} className="w-full outline-none border-none bg-transparent p-2" placeholder="Your pull request URL link" />
                    </div>
                    <button
                        className={`bg-primary_orange-0 text-white rounded-md px-8 py-3 text-sm ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 transition duration-300'}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Validating...' : 'Validate'}
                    </button>
                </form>
            ) : (
                <div className="text-white mt-4">
                    <h2 className="font-semibold text-xl">Login to validate your PRs</h2>
                </div>
            )}
        </div>
    );
};

export default ValidatePR;