import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1000,
  iterations: 10000,
};

export default function() {
  let res = http.post("http://127.0.0.1:3000/send", JSON.stringify({
    type: "color",
    message: "Hello Ritul"
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });

  check(res, {
    "status was 200": (r) => r.status == 200,
    // "transaction time OK": (r) => r.timings.duration < 500
  });

  sleep(1);
}
