import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { Parser } from "@json2csv/plainjs";

export { fetchSampleData, fetchFullData, saveCSV };

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: import.meta.env.VITE_GITHUB_API_TOKEN,
});

//TODO: Make the first fetch a "sample" fetch with octokit.request, then make a subsequent fetch a full paginate fetch.
//TODO: Implement stream fetch with rendering, for large data sets.

async function fetchSampleData(owner, repo) {
  try {
    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      // 100 Per page is the maximum afforded by the GitHub API.
      per_page: 100,
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
        additions: commitDetail.data.stats.additions,
        deletions: commitDetail.data.stats.deletions,
        total: commitDetail.data.stats.total,
      };
      commitDetails.push(info);
    }
    return commitDetails;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

//Refactor.
async function fetchFullData(owner, repo) {
  try {
    const commits = await octokit.paginate(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner,
        repo,
        per_page: 100,
      },
    );
    const fetchCommitDetails = async (commit) => {
      const commitDetail = await octokit.request(
        "GET /repos/{owner}/{repo}/commits/{sha}",
        {
          owner,
          repo,
          sha: commit.sha,
        },
      );
      return {
        sha: commitDetail.data.sha,
        author: commitDetail.data.commit.author.name,
        email: commitDetail.data.commit.author.email,
        date: commitDetail.data.commit.author.date,
        additions: commitDetail.data.stats.additions,
        deletions: commitDetail.data.stats.deletions,
        total: commitDetail.data.stats.total,
      };
    };

    const batchSize = 10;
    let commitDetails = [];

    for (let i = 0; i < commits.length; i += batchSize) {
      // Create a batch of promises for each set of commits
      const commitBatch = commits.slice(i, i + batchSize);
      const detailsPromises = commitBatch.map(fetchCommitDetails);
      // Await the array of promises returned by Promise.all
      const details = await Promise.all(detailsPromises);
      commitDetails = commitDetails.concat(details);
    }
    return commitDetails;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
}

function saveCSV(data) {
  try {
    const parser = new Parser();
    const csv = parser.parse(data);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Maakaf-Data.csv";
    link.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(`Error saving CSV: ${error}`);
  }
}
