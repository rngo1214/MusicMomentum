var success = false;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start_button').addEventListener('click', function (e) {
    fetch('/spotifyRedirectUri')
    .then(e => e.json())
    .then(data => {
      var x = document.getElementById("grid");
      var xList = document.querySelectorAll("input[type='checkbox']");
      var checkedNum = 0;
      xList.forEach(el => {
        if (el.checked) {
          checkedNum++;
        }
      });

      if (checkedNum == 0) {
        alert("Please first select your choices.");
      } else if (checkedNum > 5) {
        alert("Please only select five (5) choices.");
      } else if (success) {
        window.location = '/login.html';
      } else if (!success) {
        success = true;
        window.location = data.redirectUri;
      }
    })
    .catch(error => { alert("Failed to prepare for Spotify Authentication")});
  });
});

function btnActivate() {
  var x = document.getElementById("grid");
  var xList = document.querySelectorAll("input[type='checkbox']");
  var checkedNum = 0;
  xList.forEach(el => {
    if (el.checked) {
      checkedNum++;
    }
  });
  if (checkedNum == 0) {
    alert("Please first select your choices.");
  } else if (checkedNum > 5) {
    alert("Please only select five (5) choices.");
  }
}

