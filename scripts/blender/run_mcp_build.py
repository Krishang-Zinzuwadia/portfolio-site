"""Run the Signal Terminal build through the installed Blender MCP server."""

from __future__ import annotations

import asyncio
from datetime import timedelta
import json
import os
from pathlib import Path

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


ROOT = Path(__file__).resolve().parents[2]
BUILD_SCRIPT = ROOT / "scripts" / "blender" / "build_signal_terminal.py"
UVX = Path(r"C:\Users\kingg\AppData\Local\hermes\bin\uvx.exe")


def dump_result(label: str, result) -> None:
    print(label)
    print(json.dumps(result.model_dump(mode="json"), indent=2))


async def main() -> None:
    environment = os.environ.copy()
    environment.update(
        {
            "BLENDER_HOST": "127.0.0.1",
            "BLENDER_PORT": "9876",
            "DISABLE_TELEMETRY": "true",
            "UV_PYTHON_PREFERENCE": "only-managed",
        }
    )

    server = StdioServerParameters(
        command=str(UVX),
        args=["--python", "3.11", "blender-mcp"],
        env=environment,
        cwd=ROOT,
    )

    async with stdio_client(server) as (reader, writer):
        async with ClientSession(
            reader,
            writer,
            read_timeout_seconds=timedelta(minutes=20),
        ) as session:
            await session.initialize()

            tools = await session.list_tools()
            print("MCP_TOOLS", ", ".join(tool.name for tool in tools.tools))

            before = await session.call_tool(
                "get_scene_info",
                arguments={"user_prompt": "Build an original 3D hero asset for Krishang's portfolio."},
            )
            dump_result("SCENE_BEFORE", before)

            code = (
                "from pathlib import Path\n"
                f"build_path = Path({str(BUILD_SCRIPT)!r})\n"
                "exec(compile(build_path.read_text(encoding='utf-8'), str(build_path), 'exec'))"
            )
            built = await session.call_tool(
                "execute_blender_code",
                arguments={
                    "code": code,
                    "user_prompt": (
                        "Create a commercially safe, original retro-futurist Signal Terminal model, "
                        "then export its Blender source, GLB, and transparent poster render."
                    ),
                },
                read_timeout_seconds=timedelta(minutes=20),
            )
            dump_result("BUILD_RESULT", built)

            after = await session.call_tool(
                "get_scene_info",
                arguments={"user_prompt": "Verify the completed Signal Terminal scene."},
            )
            dump_result("SCENE_AFTER", after)

            terminal = await session.call_tool(
                "get_object_info",
                arguments={
                    "object_name": "Terminal_Case",
                    "user_prompt": "Verify the primary model geometry and material assignment.",
                },
            )
            dump_result("TERMINAL_CASE", terminal)


if __name__ == "__main__":
    asyncio.run(main())
