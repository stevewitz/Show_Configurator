var count =1;
var wiz = {};
var welcomePath;
var dropzoneId ="Welcome";

document.addEventListener('dragenter', (e) => {
    if (e.target.id != dropzoneId) {
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
}, false);
//
//
// this is for drop of welcome image


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
        welcomePath= f.path;
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

//
// end of Welcome image drop
//
//

function saveButton() {
    console.log("save buton pressed");
    let result = document.getElementById("wizdat").elements;


    for (i=0 ; i<result.length; i++){ //get all text box inputs
        if(result[i].type =="text") {
            console.log(result[i].name + ":" + result[i].value);
            wiz[result[i].name] = result[i].value;
        }
        else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
            console.log(result[i].name +":" + result[i].value);
            wiz[result[i].name] = result[i].value;
        }
    }
    wiz["Nothing"] = "SHOW  SETTINGS";
    wiz["Version"] = Date.now();
    let result1 = document.getElementById("services").elements;

    for (i=0 ; i<result1.length; i++) { //get all service inputs
        wiz["service"] = wiz["service"] || []; // initialize wiz.service
        if (result1[i].type == "text") {
            console.log(result1[i].name + ":" + result1[i].value);
            wiz["service"].push(result1[i].value);
        }
    }


    let wizJsonString =  JSON.stringify(wiz );
    console.log(wizJsonString);
}

function addService() {
    var br = document.createElement("br");
    var newService = document.createElement("Input");
    var newServiceLabel=document.createElement("Label");
    newServiceLabel.innerText="Service" + count + " ";
    count ++;
    document.getElementById("services").appendChild(newServiceLabel);
    document.getElementById("services").appendChild(newService);
    document.getElementById("services").appendChild(br);
}