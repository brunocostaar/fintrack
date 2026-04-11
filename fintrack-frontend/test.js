async function test() {
  const loginRes = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email: "brunoo.lcn@gmail.com", password: "18082005Bb**"})
  });
  console.log("LOGIN STATUS:", loginRes.status);
  const loginData = await loginRes.json();
  console.log("LOGIN TOKEN:", loginData.token);
  
  const txRes = await fetch("http://localhost:8080/api/transactions", {
    headers: { "Authorization": `Bearer ${loginData.token}` }
  });
  console.log("TX STATUS:", txRes.status);
  const text = await txRes.text();
  console.log("TX RESPONSE:", text);
}
test();
