let player_list; 

if (localStorage.getItem('List') !== null) {
  player_list = out();
} else {
  let blank = [];
  store(blank);
  player_list = out();
}

function store(input) {
  let list_serial = JSON.stringify(input);
  localStorage.setItem('List', list_serial);
}

function out(){
  let list_deserial = JSON.parse(localStorage.getItem('List'));
  return list_deserial;
}

displayPlayers()
function displayPlayers() {
  let player_list = out();
  const leaderboard = document.querySelector('.leaderboard_container');
  leaderboard.innerHTML = "";

  for (let i = 0; i < player_list.length; i++) {
    // Create player container
    const player_container = document.createElement('div');
    player_container.classList.add('player_container');
    
    //Creating Inside Player Container
    const player_left_sidebar = document.createElement('div');
    player_left_sidebar.classList.add('player_left_sidebar');
    
    const delete_button = document.createElement('button');
    delete_button.classList.add('player_delete');
    delete_button.style.display = 'none'; //Making it appear deleted
    
    const garbage = document.createElement('img');
    garbage.setAttribute('src', 'images/garbage.png');
    garbage.setAttribute('width', '20');
    delete_button.appendChild(garbage);

    const player_name = document.createElement('p');
    player_name.classList.add('player_name')
    player_name.setAttribute('contenteditable', 'true')
    player_name.innerHTML = player_list[i].name;

    player_left_sidebar.appendChild(player_name); //Appending player_name to leftsiderbar
    player_left_sidebar.appendChild(delete_button); //Apending hidden delete to leftsidebar
    player_container.appendChild(player_left_sidebar);
      
    //Creating sidebar in Player Container
    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar')
    const button = document.createElement('button');
    button.classList.add('update_balance');
    button.innerHTML = '+';
    
    const bal = document.createElement('Balance');
    bal.classList.add('player_balance');
    bal.innerHTML = player_list[i].balance;
    
    //Apending to sidebar
    sidebar.appendChild(button);
    sidebar.appendChild(bal);
      
    //Apending sidebar to Playercontainer
     player_container.appendChild(sidebar);
      
    //Appending elements to li, 
    let li = document.createElement('li');
    li.appendChild(player_container);

    leaderboard.appendChild(li)

    player_name.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        player_name.blur(); // Exit editing on Enter
      }
    });
    player_name.addEventListener('blur', () => {
      player_list[i].name = player_name.textContent; // Update name in player_list
      store(player_list);
    });
  
    //Changing Balance 
    button.addEventListener('click', () => {
      if (button.style.display === "none") {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
  
      sidebar.classList.remove('sidebar');
      sidebar.classList.add('sidebar_edit');
  
      const input = document.createElement('div');
      input.classList.add('input');
      sidebar.appendChild(input);
      
      //Enter and Updating balance
      const change_balance = document.createElement('input');
      change_balance.classList.add('change_balance');
      change_balance.setAttribute('contenteditable', 'true')
      change_balance.setAttribute('type', 'number');
      change_balance.placeholder = 'Enter';
      input.appendChild(change_balance);
  
        //Changing Balance
      change_balance.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          change_balance.blur(); // Exit editing on Enter
          closeinput(close, input, sidebar, button)
        }
      });
      change_balance.addEventListener('blur', () => {
        player_list[i].balance += parseFloat(change_balance.value); // Update Balance in player_list
        bal.innerHTML = player_list[i].balance;
        checkbalance(player_list[i], player_container)
        store(player_list);
      }); 
  
      //Close button without entry
      const close = document.createElement('button');
      close.classList.add('close');
      close.innerHTML = '-';
      input.appendChild(close);
      
      close.addEventListener('click', () => {
        closeinput(close, input, sidebar, button);
      });
    })

    //Deleting Players 
    const delete_summon = document.querySelector('.delete_player_real');
    delete_summon.addEventListener('click', () => {
      summonDelete(delete_button); //Creating the delete button
    });

    delete_button.addEventListener('click', () => {
      deletePlayer(i, delete_button); //Deleting player from lsit 
    })

    checkbalance(player_list[i], player_container); //Checking whether player is green or red
  }
}

//Deleting Players
function summonDelete(delete_button) {
  if (delete_button.style.display === "none") {
    delete_button.style.display = "block";
  } else {
    delete_button.style.display = "none";
  }
}

function deletePlayer(i, delete_button) {
  let list = out();
  list.splice(i, 1)
  delete_button.style.display = 'none';
  store(list);
  displayPlayers();
}

//Adding Players
const add_player_button = document.querySelector('.add_player');
add_player_button.addEventListener("click", addPlayer);

function addPlayer() {
  let list = out();
  const temp = {name: 'Untitled', balance: 0};
  list.push(temp);
  store(list);
  displayPlayers();
}

//Closing input function
function closeinput(close, input, sidebar, button) {
  close.remove();
  input.remove();

  sidebar.classList.remove('sidebar_edit');
  sidebar.classList.add('sidebar');

  if (button.style.display === "none") {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
  console.log(player_list)
}

//Checking whether player is network
function checkbalance(newPlayer, player_container){
  player_container.classList.remove(
    'player_container_positive',
    'player_container_negative'
  );

  if (newPlayer.balance >  0) {
    player_container.classList.add('player_container_positive')
  } else if (newPlayer.balance === 0) {
    player_container.classList.add('player_container')
  } else {
    player_container.classList.add('player_container_negative')
  }
}

//Sorting players based on balance 
const sort_button = document.querySelector('.sort_player');
sort_button.addEventListener("click", sortPlayer);

function sortPlayer() {
  let list = out();
  list.sort((a,b) => b.balance - a.balance)
  store(list);
  displayPlayers()
}
