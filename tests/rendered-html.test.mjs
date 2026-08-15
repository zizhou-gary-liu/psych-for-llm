import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the interactive EACL research companion", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Psych for LLM — An Interactive Research Map<\/title>/i);
  assert.match(html, /Borrow the theory/);
  assert.match(html, /The 60-second takeaway/);
  assert.match(html, /Explore the research landscape/);
  assert.match(html, /The paper’s calls to action/);
  assert.match(html, /For young researchers/);
  assert.match(html, /227/);
  assert.match(html, /126/);
  assert.match(html, /Contribute on GitHub/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});
