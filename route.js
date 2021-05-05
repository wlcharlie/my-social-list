const dataAPI = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";
const dataPanel = document.querySelector("#dataPanel");
const dataUser = [];

// modal variables
const cardAvatar = document.querySelector("#card-avatar");
const cardUserName = document.querySelector("#card-user-name");
const cardGender = document.querySelector("#card-gender");
const cardBirth = document.querySelector("#card-birth");
const cardRegion = document.querySelector("#card-region");
const cardEmail = document.querySelector("#card-email");
const delButton = document.querySelector(".deleting");

const getList = JSON.parse(localStorage.getItem('listForRoutePage'))

function dataRender(data) {
  let rawHTML = ''
  data.forEach((user) => {
    rawHTML += `
      <div class=".col mx-1 my-1">
        <div class="user-info" data-toggle="modal" data-target="#cardUser">
          <div class="card border-white" style="width: 160px">
            <div class="user-avatar">
              <img class="card-img-top rounded-top mw-100" src="${user.avatar}" alt="Card image cap" data-toggle="modal" data-target="#cardUser" data-id="${user.id}">
            </div>
            <div class="card-body rounded">
              <h6 class="card-title text-center"  data-toggle="modal" data-target="#cardUser" data-id="${user.id}">${user.name} ${user.surname}</h6>
            </div>
          </div>
        </div>
      </div>
      `;
  });
  dataPanel.innerHTML = rawHTML
}

dataPanel.addEventListener("click", function (event) {
  const target = event.target;
  const userId = target.dataset.id;

  if (target.matches(".card-img-top") || target.matches(".card-title")) {
    axios
      .get(dataAPI + userId)
      .then(function (response) {
        const data = response.data;
        cardAvatar.src = `${data.avatar}`;
        cardUserName.innerHTML = `${data.name} ${data.surname}`;
        cardGender.innerHTML = `<i class="fas fa-venus-mars mr-1"></i> Gender: ${data.gender}`;
        cardBirth.innerHTML = `<i class="fas fa-birthday-cake mr-1"></i> Date of Birth: ${data.birthday}`;
        cardRegion.innerHTML = `<i class="fas fa-flag mr-1"></i> Region: ${data.region}`;
        cardEmail.innerHTML = `<i class="fas fa-envelope mr-1"></i> E-mail: ${data.email}`;
        delButton.removeAttribute("disabled", "")
        delButton.setAttribute("data-id", `${data.id}`)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

delButton.addEventListener('click', function (event) {
  let userId = event.target.dataset.id
  let userIndexInList = getList.findIndex((a) => `${a.id}` === userId)

  getList.splice(userIndexInList, 1)
  alert(`您移除了一位隊友...`)
  dataRender(getList)
  localStorage.setItem('listForRoutePage', JSON.stringify(getList))
})

dataRender(getList)