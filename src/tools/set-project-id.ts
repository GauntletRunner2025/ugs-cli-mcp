import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerSetProjectId(server: McpServer) {
  server.tool(
    "set-project-id",
    "Set the UGS project ID",
    {
      projectId: z.string().describe("The project ID to set"),
    },
    async ({ projectId }) => {
      const execAsync = promisify(exec);
      try {
        const { stdout, stderr } = await execAsync(`ugs config set project-id ${projectId}`);
        if (stderr) {
          return { content: [{ type: "text", text: `Error setting project ID: ${stderr}` }] };
        }
        return { content: [{ type: "text", text: stdout.trim() || `Successfully set project ID to: ${projectId}` }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: `Failed to set project ID: ${error.message}` }] };
      }
    }
  );
}
