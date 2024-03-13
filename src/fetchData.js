import { Octokit } from "@octokit/core";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_API_TOKEN,
});

async function fetchData(owner, repo) {
  try {
    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
    });

    const commitDetails = [];
    for (const commit of commits.data) {
      const commitDetail = await octokit.request(
        "GET /repos/{owner}/{repo}/commits/{sha}",
        {
          owner,
          repo,
          sha: commit.sha,
        },
      );

      const info = {
        sha: commitDetail.data.sha,
        author: commitDetail.data.commit.author.name,
        email: commitDetail.data.commit.author.email,
        date: commitDetail.data.commit.author.date,
        additions: commitDetail.data.stats.deletions,
        deletions: commitDetail.data.stats.additions,
        total: commitDetail.data.stats.total,
      };
      commitDetails.push(info);
    }

    return commitDetails;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

export default fetchData;
