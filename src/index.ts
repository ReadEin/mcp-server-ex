import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import process from "node:process";
import { z } from "zod";
import { registerNwsTool } from "./tool/nws.js";

// Create server instance
const server: McpServer = new McpServer({
  name: "mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {
      list: true,
      read: true,
    },
    tools: {
      list: true,
      call: true,
    },
    prompts: {
      list: true,
      get: true,
    },
  },
});

const global: any = globalThis;
global.mcp = server;

// 기본 프롬프트 등록
server.prompt(
  "default",
  "Default prompt",
  {},
  async () => {
    return {
      messages: [{
        role: "assistant",
        content: {
          type: "text",
          text: "This is a default prompt",
        },
      }],
    };
  }
);

// NWS 툴 등록
registerNwsTool(server);

async function main() { 
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
  
  main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });