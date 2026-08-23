import http from "k6/http";
import { check, sleep } from "k6";


export const options = {
  vus: 100,
  duration: "1m",
};



export default function () {


  const payload = JSON.stringify({

    email: "kirangawande9307@gmail.com",

    password: "123456"

  });



  const params = {

    headers: {

      "Content-Type": "application/json"

    }

  };



  const res = http.post(

    "http://localhost:5000/api/auth/login",

    payload,

    params

  );

  console.log("Status:",res.status)
  console.log("Message:",res.message)



  check(res, {
    "login success":
      (r)=> r.status === 200
  });


  sleep(1);

}