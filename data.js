import fetch from "node-fetch";

for (var i = 10060; i < 10070; i++) {
  fetch(`https://www.managemydata.eu/requestDataCopy?productId=${i}`)
    .then(res => res.text())
    .then(body => console.log(body));
}
