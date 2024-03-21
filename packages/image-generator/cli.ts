import { Command } from "commander";
import { buildRelative } from "./index";

const program = new Command();

program
  .option('-i, --image <string>', 'Image path')
  .option('-d, --date <string>', 'Date string');

program.parse(process.argv);

const options = program.opts();

const image = options.image && typeof options.image === 'string' ? options.image : null;
const date = options.date && typeof options.date === 'string' ? options.date : null;

if (image && date) {
  buildRelative({ image, date });
} else {
    console.error("Both image and date flags are required.");
    process.exit(1);
}
