import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { Parser } from "@json2csv/plainjs";

export { fetchSampleData, fetchFullData, getRepositoriesOfOwner, saveCSV };

const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: import.meta.env.VITE_GITHUB_API_TOKEN,
});

// Fetch a sample of the data on commits from a repository
async function fetchSampleData(owner, repo) {
  try {
    const commits = await octokit.request("GET /repos/{owner}/{repo}/commits", {
      owner,
      repo,
      per_page: 100,
    });
    const commitPromises = commits.data.map((commit) =>
      octokit
        .request("GET /repos/{owner}/{repo}/commits/{sha}", {
          owner,
          repo,
          sha: commit.sha,
        })
        .then((commitDetail) => ({
          sha: commitDetail.data.sha,
          author: commitDetail.data.commit.author.name,
          email: commitDetail.data.commit.author.email,
          date: new Date(
            commitDetail.data.commit.author.date,
          ).toLocaleDateString("en-IL", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
          }),
          additions: commitDetail.data.stats.additions,
          deletions: commitDetail.data.stats.deletions,
          total: commitDetail.data.stats.total,
        })),
    );
    let commitSample = await Promise.all(commitPromises);
    return commitSample;
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
    return [];
  }
}

// Fetch all data on commits from a repository.
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
        date: new Date(commitDetail.data.commit.author.date).toLocaleDateString(
          "en-IL",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZoneName: "short",
          },
        ),
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
    return [];
  }
}

// Function to get repositories of an owner, used for the dropdown menu
async function getRepositoriesOfOwner(owner) {
  let page = 1;
  let allRepos = [];
  while (true) {
    const res = await octokit.request("GET /users/{owner}/repos", {
      owner,
      per_page: 100,
      page: page,
    });
    allRepos = allRepos.concat(res.data);
    if (res.data.length < 100) {
      break;
    }
    page++;
  }
  return allRepos;
}

// Saves a file in CSV format
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
