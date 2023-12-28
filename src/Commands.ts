import { Command } from "./Command";
import { Ping } from "./commands/Ping";
import { Search } from "./commands/Search";
import { Status } from "./commands/Status";
import { Test } from "./commands/Test";

export const Commands: Command[] = [Ping, Test, Search, Status];
