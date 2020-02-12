import axios from "axios";
import Writer from "./writer";
import fs = require("fs");
import path = require("path");
const url = `https://a0.p.awsstatic.com/pricing/1.0/ec2/region/us-east-1/ondemand/linux/index.json?timestamp=${+new Date()}`;

const removeTrailingZero = (s: string): string => parseFloat(s).toString();

axios
  .get(url)
  .then(function(response) {
    const w = new Writer("Amazon AWS Server Price");
    w.writeText("aws server price");
    let data = [];
    response.data.prices.forEach(e => {
      data.push([
        e["attributes"]["aws:ec2:instanceType"],
        e["attributes"]["aws:ec2:vcpu"],
        e["attributes"]["aws:ec2:memory"],
        removeTrailingZero(e["price"]["USD"])
      ]);
    });
    data = data.sort((l, r) => {
      if (l[0] > r[0]) {
        return 1;
      }
      return -1;
    });
    w.writeTable(
      ["instance", "cpu", "memory", "price"],
      ["", "", "", ""],
      data
    );

    fs.writeFile(
      path.join(__dirname, "../source/_posts/dynamic/aws_server_price.md"),
      w.getContent(),
      function(err) {
        if (err) {
          return console.error(err);
        }
        console.log("File created!");
      }
    );
  })
  .catch(function(error) {
    // handle error
    console.log(error);
  })
  .then(function() {
    // always executed
  });
