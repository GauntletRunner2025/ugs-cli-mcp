import { exec } from "child_process";
import { promisify } from "util";
export function registerGetVersion(server) {
    server.tool("get-version", "Get the version of UGS CLI", {}, async () => {
        const execAsync = promisify(exec);
        try {
            const { stdout, stderr } = await execAsync('ugs --version');
            if (stderr) {
                return { content: [{ type: "text", text: `Error getting version: ${stderr}` }] };
            }
            return { content: [{ type: "text", text: stdout.trim() }] };
        }
        catch (error) {
            return { content: [{ type: "text", text: `Failed to get UGS version: ${error.message}` }] };
        }
    });
}
