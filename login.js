const inputUsername = document.querySelector('#username');
const inputPassword = document.querySelector('#password');
const btnLogin = document.querySelector('#login');

main();

function main(){
  btnLogin.addEventListener('click', () => {
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({"username": inputUsername.value, "password": inputPassword.value});
    
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