import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";

export function registerSetProjectId(server) {
    server.tool("set-project-id", "Set the UGS project ID", {
        projectId: z.string()
            .refine(
                (id) => {
                    // Remove dashes and check if it's exactly 32 characters
                    const strippedId = id.replace(/-/g, '');
                    if (strippedId.length !== 32) return false;
                    
                    // Check if it matches the format with dashes (36 chars) or without (32 chars)
                    const withDashesRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                    const withoutDashesRegex = /^[0-9a-f]{32}$/i;
                    
                    return withDashesRegex.test(id) || withoutDashesRegex.test(id);
                },
                "Project ID must be a valid UUID format (36 characters with dashes or 32 characters without dashes)"
            )
            .describe("The project ID to set"),
    }, async ({ projectId }) => {
        const execAsync = promisify(exec);
        try {
            const { stdout, stderr } = await execAsync(`ugs config set project-id ${projectId}`);
            if (stderr) {
                return { content: [{ type: "text", text: `Error setting project ID: ${stderr}` }] };
            }
            return { content: [{ type: "text", text: stdout.trim() || `Successfully set project ID to: ${projectId}` }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Failed to set project ID: ${error.message}` }] };
        }
    });
}
