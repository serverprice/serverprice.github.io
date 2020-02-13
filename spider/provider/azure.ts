import axios from "axios";

export function azure(
  callback: (
    error: any,
    columns: Array<string>,
    data: Array<Array<string>>
  ) => void
): void {
  const url = `https://azure.microsoft.com/api/v3/pricing/virtual-machines/calculator/?culture=en-us&discount=mosp&v=20200211-1500-144282`;
  const zone = "us-west";
  axios
    .get(url)
    .then(function(response) {
      let data = [];
      for (let k in response.data.offers) {
        let item = response.data.offers[k];
        if (
          item.prices.perhour === undefined ||
          item.prices.perhour[zone] === undefined
        ) {
          continue;
        }
        data.push([
          k + " " + item["series"],
          item["cores"],
          item["ram"],
          item.prices.perhour[zone].value.toString()
        ]);
      }

      data = data.sort((l, r) => {
        if (l[0] > r[0]) {
          return 1;
        }
        return -1;
      });
      const columns = ["instance", "cpu", "memory", "price"];
      return callback(null, columns, data);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    });
}
