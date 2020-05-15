let dropzoneId ="Welcome";
document.addEventListener('dragenter', (e) => {
    if (e.target.id != dropzoneId) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
}, false);

document.addEventListener('drop', (e) => {

    if (e.target.id != dropzoneId) {
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
    e.preventDefault();

    for (const f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.path);
        let img = document.createElement("img");
        img.src = f.path;
        document.getElementById("Welcome").innerHTML="Welcome Screen";
        document.getElementById("Welcome").appendChild(img);
    }
    return false;
},false);
document.addEventListener('dragover', (e) => {
    if (e.target.id != dropzoneId) {
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
    e.preventDefault();
    //  e.stopPropagation();
    return false;
},false);


function saveButton() {
    console.log("save buton pressed");
    let result = document.getElementById("wizdat").elements;

    let wiz={};
    let j=0;
    for (i=0 ; i<result.length; i++){
        if(result[i].type == "text") {
            console.log(result[i].name + ":" + result[i].value);
            wiz[result[i].name] = result[i].value;
        }
        else if(result[i].type =="radio" && result[i].checked == true){
            console.log(result[i].name +":" + result[i].value);
            wiz[result[i].name] = result[i].value;
        }

    }
    wiz["Nothing"] = "SHOW  SETTINGS";
    let wizJsonString =  JSON.stringify(wiz );
    console.log(wizJsonString);

}