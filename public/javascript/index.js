var count =1;
var wiz = {};
var welcomePath;
var dropzoneId ="Welcome";
var wizJsonString;
const fs = require('fs');
const fse= require('fs-extra');
const os = require('os');
const saveLocation = os.homedir() + "/show";



document.addEventListener('dragenter', (e) => {
    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";

    }
}, false);
//
//
// this is for drop of welcome image


document.addEventListener('drop', (e) => {

    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";
    }
    e.preventDefault();
    for (const f of e.dataTransfer.files) {
        var stat = fs.lstatSync(f.path);
        var xxx = stat.isDirectory();
        if(stat.isDirectory() && (e.target.id).substring(0,4) =="show"){
            dropShowFiles(e.target.id, f.path);
        }

        else if (stat.isFile() && e.target.id == dropzoneId) { // make sure it's the correct dropzone for Welcome Image
          dropWelcome(f.path);
        }
    }
    return false;
},false);
document.addEventListener('dragover', (e) => {
    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
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





function dropWelcome(place){
    var allowedExtensions = /(\.jpg)$/i;
    if(!allowedExtensions.exec(place)) {
        alert('Please upload Welcome Image jpg file only');
    }
    else{
        let img = document.createElement("img");
        img.src = place;
        welcomePath = place;
        document.getElementById("Welcome").innerHTML = "Welcome Screen";
        document.getElementById("Welcome").appendChild(img);
    }
}

function dropShowFiles(divid, fromFolder){
    console.log("folder dropped into: "+ divid + " and sent from: " + fromFolder);
    let newdir = 'c:/Users/Steve.WIZ/Desktop/testFiles';
    fs.readdir(fromFolder, (err, files) => {
        console.log("There are this many files to copy: "+files.length);
    });
    fse.copy(fromFolder, newdir, function (err) {
       if (err) {
            console.log("eoore: " + err)
        } else {
            console.log("success!");
           fs.readdir(newdir, (err, files) => {
                      console.log("There are this many files that were coppied: "+files.length);
                  });
        }
    });
  //  fs.readdir(newdir, (err, files) => {
 //       console.log("There are this many files: "+files.length);
 //   });


}

function saveButton() {
    console.log("save buton pressed");
    let result = document.getElementById("wizdat").elements;


    for (i=0 ; i<result.length; i++){ //get all text box inputs
        if(result[i].type =="text") {
            wiz[result[i].name] = result[i].value;
        }
        else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
            wiz[result[i].name] = result[i].value;
        }
    }
    wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wizdat file
    let current_datetime = new Date();
    let formatted_date =   current_datetime.getFullYear()+appendLeadingZeroes(current_datetime.getMonth() + 1) + appendLeadingZeroes(current_datetime.getDate());
    wiz["Version"] =formatted_date; // adds version information time is MS since beginning of time....
  //  let result1 = document.getElementById("services").elements;

  //  for (i=0 ; i<result1.length; i++) { //get all service inputs
  //      wiz["service"] = wiz["service"] || []; // initialize wiz.service
 //       if (result1[i].type == "text") {
 //           wiz["service"].push(result1[i].value);
 //       }
 //   }
    wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
    wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);
    fs.writeFile(saveLocation + "/master_wiz.dat", wizJsonString, (err) => {
        if (err) throw err;
    });
    console.log(wizJsonString);
}

function saveConfigButton(){

    Swal.fire({
        title: 'Are you sure?',
        text: "New default settings will replace existing settings",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, replace it!'
    }).then((result) => {
        if (result.value) {
            console.log("save deefaults buton pressed");
            let result = document.getElementById("wizdat").elements;


            for (i=0 ; i<result.length; i++){ //get all text box inputs
                if(result[i].type =="text") {
                    wiz[result[i].name] = result[i].value;
                }
                else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
                    wiz[result[i].name] = result[i].value;
                }
            }
            wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wizdat file
            wiz["ShowName"] =""; //no show name is default settings -- also no version number in default

            fs.unlink(saveLocation + "/master_wiz.dat", (err) => {
                if (err) {
                    console.log("failed to delete file: "+err);
                } else {
                    console.log('successfully deleted local file');
                }
                wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
                wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);
                fs.writeFile(saveLocation + "/master_wiz.dat", wizJsonString, (err) => {
                    if (err) {
                        consloe.log("error: " + err);
                    }
                });



            });
            Swal.fire(
                'Replaced!',
                'Your defaults have now been replaced.',
                'success'
            )
        }
    })








}

function appendLeadingZeroes(n){
    if(n <= 9){
        return "0" + n;
    }
    return n
}
 function addNewShow(){
    document.getElementById("startup").style.display = 'none';
    document.getElementById("mainDiv").style.visibility='visible';
    document.getElementById("saveFileLocation").innerHTML = "This show will be saved in this location: " + saveLocation; //displat to user the save show location

    //check to see if directory exists
     try {
         fs.statSync(saveLocation );
     } catch(e) {
         fs.mkdirSync(saveLocation);
     }
        //check if master_wiz.dat exists
    try{
        fs.statSync(saveLocation + "/master_wiz.dat");
            console.log("file exists");
     } catch(e){
           console.log("file must be created");
        fs.writeFile(saveLocation + "/master_wiz.dat", wizJsonString, (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })
    }
    // load existing template file
 }

 function editExistingShow(){
  // add code to fetch existing shows

  console.log("Existing show goes here");
}

async function addService() {

    const { value: serviceName } = await Swal.fire({
        title: 'Enter service',
        input: 'text',
        type:'question',
        inputPlaceholder: 'Enter Service Name'
    });

    if (serviceName) {
        Swal.fire(`Entered Service: ` + serviceName)



    }





    var br = document.createElement("br");
    var newService = document.createElement("Input");
    newService.setAttribute('name', "Service"+ count);
    var newServiceLabel=document.createElement("Label");
    newServiceLabel.innerText="Service" + count + " ";
    count ++;
    document.getElementById("wizdat").appendChild(newServiceLabel);
    document.getElementById("wizdat").appendChild(newService);
    document.getElementById("wizdat").appendChild(br);



    addShowDiv("xshownumberone", "english", "ENGLISH");
    addShowDiv("yshownumberone", "french", "French");
    addShowDiv("zshownumberone", "spanish", "Spanish");
}

function addShowDiv(divId, divName,divText ){
    let div = document.createElement('div')
    div.class = "showFlex";
    div.id= divId;
    div.name= divName;
    div.innerText = divText;
    document.getElementById("flexShow").appendChild(div);
    var img = document.createElement("img");
    img.class = "showFlex1";
    img.id= divText;
    img.src = "./public/Images/folder.png" ;
    img.style.height="80px";
    img.style.margin="25px";
    img.name=divName;
    img.addEventListener("click", imageClick, false);
    var src = document.getElementById(divId);
    src.appendChild(img);
}

function imageClick(event){
    console.log(os.homedir());
    console.log("clicked: " + event.target.name)
}