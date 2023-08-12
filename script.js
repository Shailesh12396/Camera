let video=document.querySelector("video");
let record=document.querySelector(".record-btn-cont");
let recordBtn=document.querySelector(".record-btn");
let capture=document.querySelector(".capture-btn-cont");
let captureBtn=document.querySelector(".capture-btn");
let recordFlag=false;
let chunks=[];  //Media data in chunks
let recorder;
// let transparentcolor;
let constraints ={
    video:true,
    audio:true
}
//Navigator => It is a global object,It contains browser information
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
     video.srcObject=stream;
      recorder=new MediaRecorder(stream);
      recorder.addEventListener("start",(e)=>{
        chunks=[];
      })
      recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data); 
      })
      recorder.addEventListener("stop",(e)=>{
        ///Conversions of chunks into video
        let blob=new Blob(chunks,{type:"video/mp4"});
        if(db){
          let videoId=shortid();
          let videodbTransaction=db.transaction("video","readwrite");
          let videoStore = videodbTransaction.objectStore("video");
          let videoEntry={
              id: `vid-${videoId}`,
              blobData: blob
          };
          videoStore.add(videoEntry);
        }
        // let videoURL=URL.createObjectURL(blob);

        // let a=document.createElement("a");
        // a.href=videoURL;
        // a.download="stream.mp4";
        // a.click();
      })
})
 
record.addEventListener("click",(e)=>{
    if(!recorder)
    return;
    recordFlag=!recordFlag;
    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else{
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }
})
let id;
let timer=document.querySelector(".timer");
let count=0;
function startTimer(){
    timer.style.display="block";
    function displayTimer(){
        let totalSeconds=count;
        let hour=Number.parseInt(totalSeconds/3600);
        totalSeconds=totalSeconds%3600;

        let minute=Number.parseInt(totalSeconds/60);
        totalSeconds=totalSeconds%60;

        let seconds=totalSeconds;

        hour=(hour<10) ? `0${hour}` :hour;
        minute=(minute<10) ? `0${minute}` :minute;
        seconds=(seconds<10) ? `0${seconds}` :seconds;

        timer.innerText=`${hour}:${minute}:${seconds}`;
        count++;
    }
  id=setInterval(displayTimer,1000);
}
function stopTimer(){
    clearInterval(id); 
    timer.innerText="00:00:00";
}

// For capture button

capture.addEventListener("click",(e)=>{
    captureBtn.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;

    let tool=canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    let imageURL=canvas.toDataURL();
    if(db){
      let imageId=shortid();
      let imageTransaction=db.transaction("image","readwrite");
      let imageStore = imageTransaction.objectStore("image");
      let imageEntry={
          id: `img-${imageId}`,
          url: imageURL
      };
      imageStore.add(imageEntry);
    }
    setTimeout(()=>{
      captureBtn.classList.remove("scale-capture");
    },500)
    // let a=document.createElement("a");
    //     a.href=imageURL;
    //     a.download="image.jpg";
    //     a.click();
})


