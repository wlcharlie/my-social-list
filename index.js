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

const searchBar = document.querySelector('#search-bar')
const paginator = document.querySelector('#paginator')
const USER_PER_PAGE = 12
const surprise = [{ id: 000, name: "Surprise", surname: "Meow", email: "pancake@meow.com", gender: "female", birthday: "2019-05-10", region: "TW", avatar: "https://i.imgur.com/5XoWuIYt.jpg" }]
const addButton = document.querySelector(".adding")
const addList = JSON.parse(localStorage.getItem('listForRoutePage'))


axios
  .get(dataAPI)
  .then(function (response) {
    dataUser.push(...response.data.results);
    dataRender(dataUser.slice(0, USER_PER_PAGE));
    pageRender()
  })
  .catch(function (error) {
    console.log(error);
  });

function dataRender(data) {
  let rawHTML = ''
  data.forEach((user) => {
    rawHTML += `
      <div class=".col mx-1 mb-1">
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

function pageRender() {
  const TOTAL_PAGE = Math.ceil(dataUser.length / USER_PER_PAGE)
  for (let page = 0; page < TOTAL_PAGE; page++) {
    paginator.innerHTML += `<li class="page-item"><a class="page-link mb-3" href="#" data-page="${page + 1}">${page + 1}</a></li>`
  }
}

dataPanel.addEventListener("click", function (event) {
  const target = event.target;
  const userId = target.dataset.id;

  if (target.dataset.id === '0') {
    cardAvatar.src = `${surprise[0].avatar}`;
    cardUserName.innerHTML = `${surprise[0].name} ${surprise[0].surname}`;
    cardGender.innerHTML = `<i class="fas fa-venus-mars mr-1"></i> Gender: ${surprise[0].gender}`;
    cardBirth.innerHTML = `<i class="fas fa-birthday-cake mr-1"></i> Date of Birth: ${surprise[0].birthday}`;
    cardRegion.innerHTML = `<i class="fas fa-flag mr-1"></i> Region: ${surprise[0].region}`;
    cardEmail.innerHTML = `<i class="fas fa-envelope mr-1" ></i> E-mail: ${surprise[0].email}`;
    addButton.setAttribute("disabled", "")
    addButton.setAttribute("data-id", "0")
  }
  else if (target.matches(".card-img-top") || target.matches(".card-title")) {
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
        addButton.removeAttribute("disabled", "")
        addButton.setAttribute("data-id", `${data.id}`)
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});

searchBar.addEventListener('keyup', function searchingName() {
  let value = searchBar.value.toLowerCase()

  let filterDataUser = dataUser.filter(user => (user.name.toLowerCase().includes(value)) || (user.surname.toLowerCase().includes(value)))

  dataRender(filterDataUser)

  if (filterDataUser.length === 0) {
    dataRender(surprise)
  } else if (!value) {
    dataRender(dataUser.slice(0, USER_PER_PAGE))
  }

  console.log(filterDataUser.length === 0)
})

paginator.addEventListener('click', function paginatorGoTo(event) {
  event.preventDefault()
  if (event.target.matches(".page-link")) {
    let page = event.target.dataset.page
    let pageItem = document.querySelectorAll('.page-item')
    let pageDataUser = dataUser.slice((page - 1) * USER_PER_PAGE, page * USER_PER_PAGE)
    dataRender(pageDataUser)
    pageItem.forEach(item => item.classList.remove('active'))
    event.target.parentElement.classList.add('active')
    searchBar.value = ""
  }
})

addButton.addEventListener('click', function (event) {
  let userId = event.target.dataset.id

  axios
    .get(dataAPI + userId)
    .then(function (response) {
      let found = addList.some((a) => a.id === response.data.id)
      if (found) {
        alert("Oops! This Guide were added! | 這位歪國人有加過了唷!")
      } else {
        addList.push(response.data)
        localStorage.setItem('listForRoutePage', JSON.stringify(addList))
        alert('已加入囉! 快去隊伍頁面查看>__<')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
})