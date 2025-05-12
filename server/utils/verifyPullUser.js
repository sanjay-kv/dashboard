import axios from "axios";

const convertPullRequestUrl = (url) => {

    const urlParts = url.split("/");
    const owner = urlParts[3];
    const repo = urlParts[4];
    const pullNumber = urlParts[6];
    
    return `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
}

const verifyPullUser = async (URL, githubID) => {

    URL = convertPullRequestUrl(URL);

    try {
        const response = await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            }
        });

        // if (response.data.user.login !== githubID) return false;

        const labels = response.data.labels || [];
        const labelNames = labels.map((label) => label.name);
        const requiredLabels = ["gssoc", "GSSoC", "Gssoc", "GSsOC", "GSSOC", "gssoc24", "GSSoC'24", "GSSoc24", "GSSoC24", "GSSOC'24", "GSSOC24"];

        const hasRequiredLabel = requiredLabels.some((label) => labelNames.includes(label));
        if (!hasRequiredLabel) return "GSSoC tag missing";

        return {
            project: response.data.head.repo.name,
            title: response.data.title,
            createdBy: response.data.user.login,
            pullURL: response.data.html_url,
            status: response.data.state === "closed" ? (response.data.merged ? "merged" : "closed") : "open",
            labels: labels.map((label) => label.name)
        };
    } catch (error) {
        console.error("Error verifying pull request: \n", error.message);
        return false;
    }
};

export default verifyPullUser;