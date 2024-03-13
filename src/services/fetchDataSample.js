import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { Parser } from "@json2csv/plainjs";

export { fetchDataSample, saveCSV };

//octoKit init
//TODO: refactor.
const MyOctokit = Octokit.plugin(paginateRest);
const octokit = new MyOctokit({
  auth: import.meta.env.VITE_GITHUB_API_TOKEN,
});

//TODO: Make the first fetch a "sample" fetch with octokit.request, then make a subsequent fetch a full paginate fetch.
//TODO: Implement stream fetch with rendering, for large data sets.


async function fetchDataSample(owner, repo) {
  try {
    const commits = await octokit.request(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner,
        repo,
        per_page: 10,
      },
    );
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
