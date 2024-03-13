import React from "react";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { CodeIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

function InputRepo({ handleFetch, handleDownload, loadingStatus }) {
  const [owner, setOwner] = React.useState("hasadna");
  const [repo, setRepo] = React.useState("open-bus-map-search");

  function handleSubmit(owner, repo) {
    handleFetch(owner, repo);
    setRepo("");
    setOwner("");
  }

  return (
    <Flex gap="4" justify="center">
      <TextField.Root>
        <TextField.Slot>
          <GitHubLogoIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Input
          placeholder="Enter Owner…"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </TextField.Root>

      <TextField.Root>
        <TextField.Slot>
          <CodeIcon height="16" width="16" />
        </TextField.Slot>
        <TextField.Input
          placeholder="Enter Repo…"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
      </TextField.Root>

      <Button
        size="2"
        variant="soft"
        onClick={() => handleSubmit(owner, repo)}
        disabled={loadingStatus === true}
      >
        {loadingStatus === true ? "Loading..." : "Fetch Data Sample"}
      </Button>
      <Button
        size="2"
        variant="soft"
        color="crimson"
        disabled={loadingStatus === true}
        onClick={() => handleDownload()}
      >
        {loadingStatus === true ? "Loading..." : "Download CSV"}
      </Button>
    </Flex>
  );
}

export default InputRepo;