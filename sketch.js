var database ,dog,dog1,dog2;
var position;
var feed,add;
var foodobject;
var Feedtime;
var Lastfeed;
var gameState,readState;

var bedroom,washroom,garden;
var bedroomImg,washroomImg,gardenImg;
var tina;
//Create variables here

function preload(){
  dogimg1 = loadImage("dogImg.png");
  dogimg2 = loadImage("dogImg1.png");

  bedroomImg = loadImage("BedRoom.png");
  washroomImg = loadImage("Wash Room.png");
  gardenImg = loadImage("Garden.png");
	//load images here
}

function setup() {
	createCanvas(500, 700);
  database = firebase.database();
  //console.log(database);
 
  foodobject=new Food()
  dog = createSprite(250,350,10,10);
  dog.addImage(dogimg1)
  dog.scale=0.2
  
 /* bedroom = createSprite(250,300,0,0);
 bedroom.addImage(bedroomImg);
 bedroom.visible=false;

 washroom = createSprite(250,300,0,0);
 washroom.addImage(washroomImg);
 washroom.visible=false;

 garden = createSprite(250,300,0,0);
 garden.addImage(gardenImg);
 garden.visible=false; */


var dogo = database.ref('Food');
dogo.on("value", readPosition, showError);

feed = createButton("FEED DRAGO")
feed.position(350,15)
feed.mousePressed(FeedDog)

add = createButton("ADD FOOD")
add.position(250,15)
add.mousePressed(AddFood)

readState = database.ref('gameState');
readState.on("value",function(data){
   gameState=data.val();
})

readTime = database.ref('FeedTime');
readTime.on("value",function(data){
  Lastfeed=data.val();
})

} 

function draw(){
  background(46,139,87);
  drawSprites();
  textSize(32);
  text("LastFedTime : "+Lastfeed,20,10)
  
 if(gameState!="hungry"){
   feed.hide();
   add.hide();
   dog.remove();
 }else{
   feed.show();
   add.show();
   dog.addImage(dogimg1);
 }

 var currentTime=minute();
 console.log("current"+currentTime);
 console.log("lastfeedTime"+Lastfeed);
 if(currentTime===(Lastfeed+1)){
   console.log("1");
   update("Playing");
   foodobject.garden()
 }else if(currentTime===(Lastfeed+2)){
  update("Bathing");
  foodobject.washroom();
}else if(currentTime===(Lastfeed+3)){
  update("sleeping");
  foodobject.bedroom();
}

 drawSprites();
  
  fill(255,255,254);
 textSize(15);
  //add styles here
drawSprites();
}
function readPosition(data){
  position = data.val();
  foodobject.updateFoodStock(position)
  
}

function showError(){
  console.log("Error in writing to the database");
}

function writePosition(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    'Food': nazo
  })

}
function AddFood(){
position++
database.ref('/').update({
  Food:position
})
}


function FeedDog(){

dog.addImage(dogimg2)
foodobject.updateFoodStock(foodobject.getFoodStock()-1)
 database.ref('/').update({
   Food:foodobject.getFoodStock(),
   FeedTime:minute()
 })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
