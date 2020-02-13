import axios from "axios";
const removeTrailingZero = (s: string): string => parseFloat(s).toString();

export function amazon(
  callback: (
    error: any,
    columns: Array<string>,
    data: Array<Array<string>>
  ) => void
): void {
  const url = `https://a0.p.awsstatic.com/pricing/1.0/ec2/region/us-east-1/ondemand/linux/index.json?timestamp=${+new Date()}`;

  axios
    .get(url)
    .then(function(response) {
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
