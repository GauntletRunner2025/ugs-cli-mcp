import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetVersion, registerSetProjectId } from './tools/index.js';
async function main() {
    const server = new McpServer({
        name: "ugs-cli-mcp",
        version: "1.0.0",
    });
    // Register all tools
    registerGetVersion(server);
    registerSetProjectId(server);
    // Start the server
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
