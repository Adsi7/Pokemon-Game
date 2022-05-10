
  const gameState={
  //aktuell Pokemonauswahl speichern
  pokemon:"",
  pokemonCpu :"",
  pokemons : [
    {
      name: 'charmander',
      type: 'fire',
      attack: 52,
      hp: 39,
      defense: 43,
      level: 1,
      color: "#f04d26"
    },
    {
      name: 'bulbasaur',
      type: 'grass',
      attack: 49,
      defense:49,
      hp: 45,
      level: 1,
      color:"green"
    },
    {
      name: 'squirtle',
      type: 'water',
      attack: 48,
      hp:44,
      defense: 65,
      level: 1,
      color:"blue"
    }
  ],
}


//elements und auswahl
let pokemonsEL= document.querySelector(".select-screen").querySelectorAll(".character");
let battleScreenEl= document.getElementById("battle-screen")
let choosePokemon= document.getElementsByClassName("bild")[0];
let choosePokemonCpu=document.getElementsByClassName("bild2")[0];
let attackBtnsEl= document.querySelectorAll(".attack");
let namePlayer=document.querySelector(".player").querySelector(".name");
let nameCpu=document.querySelector(".cpu").querySelector(".name");
let selectScreen = document.querySelector(".select-screen");
let playAgain= document.querySelector(".play-again");
//random nummer zwischen 1 und 3
let random= ()=>{
  return Math.floor(Math.random()*3);
}

//index vom jeweiligen Pokemon bestimmen
let index = object=>{
  let result=0;
  switch(object){
    case "charmander":
      result=0;
      break;
    case "bulbasaur":
      result=1;
      break;
    case "squirtle":
      result=2;
      break;
  }return result;
}


//pokemon auswahl click
let n=0;
pokemonsEL.forEach(n=>{
  n.onclick= function(){
    //ausgewählte pokemon name
    let pokemonName = this.dataset.pokemon;
  //aktuelles pokemon aktualisieren
    gameState.pokemon=pokemonName; 
    //ausgewähltes pokemon als bild darstellen
    imgPick(gameState.pokemon);
    //computer wählt pokemon
    cpuPick();
    //bild von computer pokemon
    imgPickCpu(gameState.pokemonCpu);
    //name von cpu ändern
    namePlayer.textContent=gameState.pokemon.toLocaleUpperCase()
    //name von cpu ändern
    nameCpu.textContent=gameState.pokemonCpu.toLocaleUpperCase()
    //szene wecheseln zu kamp
    battleScreenEl.classList.add("active");
    battleScreenEl.style.removeProperty("display");

    
    console.log(gameState.pokemonCpu)
    console.log(gameState.pokemon)

    // start leben von Player und Cpu
   gameState.currentPokemon.startHealth=calculateInitHealth(gameState.currentPokemon);
   gameState.currentPokemon.health=calculateInitHealth(gameState.currentPokemon);
   gameState.currentRivalPokemon.startHealth=calculateInitHealth(gameState.currentRivalPokemon);
   gameState.currentRivalPokemon.health=calculateInitHealth(gameState.currentRivalPokemon);
   console.log(gameState)
  }
})


let cpuPick=()=>{
  do{
  gameState.pokemonCpu= pokemonsEL[random()].dataset.pokemon;}
  while(gameState.pokemon===gameState.pokemonCpu);
}
let imgPick= pokemonName=>{
  console.log(index(gameState.pokemon))
  console.log(gameState.pokemons[index(gameState.pokemon)])
  choosePokemon.setAttribute("src", "http://www.smogon.com/dex/media/sprites/xy/"+pokemonName+".gif");
  gameState.currentPokemon=gameState.pokemons[index(gameState.pokemon)];

}
let imgPickCpu=pokemonNameCpu=>{
  choosePokemonCpu.setAttribute("src", "http://www.smogon.com/dex/media/sprites/xy/"+pokemonNameCpu+".gif");
  gameState.currentRivalPokemon=gameState.pokemons[index(gameState.pokemonCpu)];

}



//battle szene aktivitäten 
attackBtnsEl.forEach(i=>{
  i.onclick=function(){
    let userAttackName= this.dataset.attack;
    gameState.currentUserAttack=userAttackName;
    let cpuAttackName= attackBtnsEl[random()].dataset.attack;
    gameState.currentCpuAttack= cpuAttackName;
    play(userAttackName ,cpuAttackName);
  }
})
let calculateInitHealth= user=>{
 return (((0.20 * Math.sqrt(user.level)) * user.defense) * user.hp);
}


let userHp= document.querySelector(".player1").querySelector(".inside")
  let cpuHp= document.querySelector(".player2").querySelector(".inside")

let attackMove = (attack, level, stack, critical, enemy, attacker)=>{
  console.log(enemy.name+"healt before:"+enemy.health)
  let attackAmout= ((attack*level)*(stack+critical));
  enemy.health-=attackAmout;
  
   if(enemy.owner==="user"){
    let minus = ((enemy.health*100)/enemy.startHealth)
     userHp.style.width=(minus<=0? 0: minus) +"%";
    //health weg visuel von owner
  }else { 
    let minus=((enemy.health*100)/enemy.startHealth);
    cpuHp.style.width=(minus<=0? 0:minus)+"%";
  }
  checkWinner(enemy, attacker);
  console.log(enemy.name+"healt after:"+enemy.health);  
}
let checkWinner =(enemy, attacker)=>{
  if(enemy.health<=0){
    console.log(attacker);
    console.log("hey Winnnerr"+attacker.name)
    document.querySelector(".select-screen").style.display="none"; 
    battleScreenEl.style.display="none"; 
    
    document.getElementsByClassName("bild3")[0].setAttribute("src", "http://www.smogon.com/dex/media/sprites/xy/"+attacker.name+".gif")
    document.querySelector(".winn").textContent=attacker.name
    document.querySelector(".winn").style.color=attacker.color;
    document.querySelector(".play-again").style.background=attacker.color;
    setInterval(()=>{
      let visibility= document.querySelector(".play-again span");
      visibility.style.visibility=(visibility.style.visibility==="hidden" ? "":"hidden");
    },800)
    
   
    
    
  document.querySelector(".end-screen").classList.add("active");
 
 
}
}
   
let play = (currentUserAttack, currentCpuAttack) =>{
  
  let currentPokemon= gameState.currentPokemon;
  let currentRivalPokemon= gameState.currentRivalPokemon;
  currentPokemon.owner="user";
  currentRivalPokemon.owner="cpu";
  console.log(`Player: ${currentUserAttack} Computer: ${currentCpuAttack}`)


  //Erst wird geprüft ob die gleichen Attacken ausgewählt wurden
  if(currentUserAttack===currentCpuAttack){
    if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
      document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br> Draw";
      console.log("draw both take damage");
     // attackMove(currentPokemon.attack, currentPokemon.level, 0.8,1, currentRivalPokemon, currentPokemon);
    if(currentRivalPokemon.health>=1){
  //   attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,1, currentPokemon);
}}
  }else{
    
        switch(currentUserAttack){
         //Prüfen wer gewinnt
          case "water": 
           if(currentCpuAttack==="fire"){
            //erst prüfen ob noch beide Leben vorhanden ist
            if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
              //gewinner verkünden
              document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br>"+ "<p>"+currentPokemon.name+ " wins </p>";
              //prüfen ob Computer noch lebt
             if(currentRivalPokemon.health>=1){
               //Schaden an Verlierer
              attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,2, currentPokemon, currentRivalPokemon);}}
          }else{ 
            //erst prüfen ob noch Leben vorhanden ist
            if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
              //gewinner verkünden
              document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br>"+ "<p>"+currentRivalPokemon.name+ " wins </p>";
             //prüfen ob Computer noch lebt
            if(currentRivalPokemon.health>=1){
              //schaden an Verlierer
              attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,2, currentPokemon, currentRivalPokemon);}}}
          break;
              


          case "grass": 
           if(currentCpuAttack==="water"){
             if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
              document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br>"+ "<p>"+currentPokemon.name+ " wins </p>";
              
     
              if(currentRivalPokemon.health>=1){
                  attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,2, currentPokemon, currentRivalPokemon);}}
           }else{ 
                if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
                  document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br>"+ "<p>"+currentRivalPokemon.name+ " wins </p>";
                
              
                 if(currentRivalPokemon.health>=1){
                  attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,2, currentPokemon, currentRivalPokemon);}}}
                break;
           case "fire":
             if(currentCpuAttack==="grass"){
               if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
                document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br>"+ "<p>"+currentPokemon.name+ " wins </p>";
                
          
                if(currentRivalPokemon.health>=1){
                 attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,2, currentPokemon, currentRivalPokemon);
          }}}else {console.log("computer wins");
                 document.querySelector(".fight-btn").innerHTML=" "+currentUserAttack +" vs " +currentCpuAttack +"<br>"+ "<p>"+currentRivalPokemon.name+ " wins </p>";
                if(currentPokemon.health>=1 && currentRivalPokemon.health>=1){
          
                  if(currentRivalPokemon.health>=1){
                   attackMove(currentRivalPokemon.attack, currentRivalPokemon.level, 0.8,2, currentPokemon, currentRivalPokemon);
            break;
            }}
}

}
}
}
    //wenn nochmal gespielt werden soll : ausgangszustand wiederherstellen
    playAgain.addEventListener("click", ()=>{
      selectScreen.style.removeProperty("display"); 
      userHp.style.width="100%" 
      cpuHp.style.width="100%"; 
      document.querySelector(".fight-btn").innerHTML="Fight"
})













