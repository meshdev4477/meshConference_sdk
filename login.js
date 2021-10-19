const $ = document.querySelector.bind(document);

main();

function main(){
  $('#btn-login').addEventListener('click', () => {
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({"username": $('#input-username').value, "password": $('#input-password').value});
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(`[API_URL]/login`, requestOptions)
      .then(async response => {
        // console.log(response.status);
        const responseJson = JSON.parse(await response.text())
        if(response.status !== 200){
          alert(`login failed: [${response.status}] ${responseJson.message}`);
          return;
        }

        console.log(responseJson);
        window.sessionStorage.setItem('jwtToken', responseJson.accessToken);
        window.location.href = '/';

      })
      .catch(error => {
        alert(`error: server side error`)
        console.log('error', error)
      });

  })
}