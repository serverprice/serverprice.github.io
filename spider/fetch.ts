import axios from "axios";

import Writer from "./writer";
import fs = require("fs");
import path = require("path");

import { amazon } from "./provider/amazon";
import { azure } from "./provider/azure";

function fetchFrom(
  provider: (
    callback: (
      err: any,
      columns: Array<string>,
      data: Array<Array<string>>
    ) => void
  ) => void,
  title: string,
  output: string
) {
  provider((err, columns, data) => {
    if (err) throw err;
    const w = new Writer(title);
    w.writeText(title);

    w.writeTable(columns, ["", "", "", ""], data);

    fs.writeFile(path.join(__dirname, output), w.getContent(), function(err) {
      if (err) {
        return console.error(err);
      }
      console.log(`${title} created!`);
    });
  });
}

fetchFrom(
  amazon,
  "Amazon AWS Server Price",
  "../source/_posts/dynamic/aws_server_price.md"
);

fetchFrom(
  azure,
  "Azure Server Price",
  "../source/_posts/dynamic/azure_server_price.md"
);
