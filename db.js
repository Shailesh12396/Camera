let db;
let openRequest=indexedDB.open("myDataBase"); //Creating database
openRequest.addEventListener("success",(e)=>{
    db=openRequest.result; //Storing new data
})
openRequest.addEventListener("error",(e)=>{

})
openRequest.addEventListener("upgradeneeded",(e)=>{
    db=openRequest.result; //Getting new data
    db.createObjectStore("video",{keyPath: "id"});
    db.createObjectStore("image",{keyPath: "id"});

})