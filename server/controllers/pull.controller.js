import PullModel from "../models/pull.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ContributorModel from "../models/contributor.model.js";
import verifyPullUser from "../utils/verifyPullUser.js";
import { projectList } from '../utils/projectList.js';

// Function to verify and handle a new pull request submission
const verifyPull = asyncHandler(async (req, res) => {
    const { pullURL, githubID } = req.body;

    // Check if required fields are provided
    if (!pullURL || !githubID) {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
    }

    // Extract project URL and validate if it's participating in GSSoC
    const projectURL = pullURL.split("/").slice(0, 5).join("/");
    if (!projectList.includes(projectURL)) {
        console.log("not participate");
        return res.status(400).json({
            success: false,
            message: "The project is not participating in GSSoC'24",
        });
    }

    // Check if the pull request already exists
    const existingPull = await PullModel.findOne({ pullURL });
    if (existingPull) {
        return res.status(400).json({
            success: false,
            message: "Pull request already exists",
        });
    }

    // Verify the pull request using GitHub API
    let verified;
    try {
        verified = await verifyPullUser(pullURL, githubID);
        if (!verified) {
            return res.status(400).json({
                success: false,
                message: "Invalid Pull Request or GitHub ID",
            });
        }
        if (verified === "GSSoC tag missing") {
            return res.status(400).json({
                success: false,
                message: "GSSoC tag missing",
            });
        }
    } catch (error) {
        console.error("Error verifying pull request:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify pull request",
        });
    }

    // Create a new pull request entry
    let pull;
    try {
        pull = await PullModel.create({
            project: verified.project, 
            projectURL, 
            title: verified.title,
            createdBy: verified.createdBy,
            pullURL: verified.pullURL,
            status: verified.status,
            labels: verified.labels,
        });
    } catch (error) {
        console.error("Error creating pull request:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create pull request",
        });
    }

    // Check if the contributor already exists
    let contributor;
    try {
        contributor = await ContributorModel.findOne({ githubID: verified.createdBy });
        // If contributor doesn't exist, create a new one
        if (!contributor) {
            contributor = await ContributorModel.create({
                githubID: verified.createdBy,
            });
            console.log("Contributor created successfully");
        } else {
            // If contributor exists
            console.log("Pull request added to contributor successfully");
        }
    } catch (error) {
        console.error("Error handling contributor:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to handle contributor",
        });
    }

    // Return success response
    return res.status(200).json({
        success: true,
        message: "Pull request created successfully",
    });
});

// Function to retrieve details of a specific pull request
const pullDetails = asyncHandler(async (req, res) => {
    const pullID = req.params.id;

    // Find pull requests created by the provided pullID (githubID)
    let pull;
    try {
        pull = await PullModel.find({ createdBy: pullID });
        if (!pull) { 
            return res.status(404).json({
                success: false,
                message: "Pull request not found",
            });
        }
    } catch (error) {
        console.error("Error fetching pull request details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pull request details",
        });
    }

    // Return the details of the pull request
    return res.status(200).json({
        success: true,
        message: "Pull request details",
        data: pull,
    });
});

export { verifyPull, pullDetails };
