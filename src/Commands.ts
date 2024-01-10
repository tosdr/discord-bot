import { Command } from "./Command";
import { Ping } from "./commands/Ping";
import { Search } from "./commands/Search";
import { Status } from "./commands/Status";

export const Commands: Command[] = [Ping, Search, Status];
