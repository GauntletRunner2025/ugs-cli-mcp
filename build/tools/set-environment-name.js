import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

export function registerSetEnvironmentName(server) {
    server.tool("set-environment-name", "Set the UGS environment name", {
        environmentName: z.string()
            .min(1, "Environment name cannot be empty")
            .max(50, "Environment name must be 50 characters or less")
            .regex(/^[a-zA-Z0-9-_]+$/, "Environment name can only contain letters, numbers, hyphens, and underscores")
            .describe("The environment name to set"),
    }, async ({ environmentName }) => {
        const execAsync = promisify(exec);
        try {
            const { stdout, stderr } = await execAsync(`ugs config set environment-name ${environmentName}`);
            if (stderr) {
                return { content: [{ type: "text", text: `Error setting environment name: ${stderr}` }] };
            }
            return { content: [{ type: "text", text: stdout.trim() || `Successfully set environment name to: ${environmentName}` }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Failed to set environment name: ${error.message}` }] };
        }
    });
}
