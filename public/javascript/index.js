var count =0;
var wiz = {};
var welcomePath;
var dropzoneId ="Welcome";
var wizJsonString;
var service = [];
const fs = require('fs');
//const fse= require('fs-extra');
const os = require('os');
const copydir = require('copy-dir');
const saveLocation = os.homedir() + "\\show";

document.addEventListener('dragenter', (e) => {
    if ((e.target.id != dropzoneId) && ((e.target.id).substring(0,4) !="show" )  ){
        e.preventDefault();
        e.dataTransfer.effectAllowed = "none";
        e.dataTransfer.dropEffect = "none";

    }

}, false);
//
//
// this is for drop of welcome image BELOW


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
// end of Welcome image drop ABOVE
//
//
//********************* Drop Welcome Image Here  ******************************
function dropWelcome(place){
    var allowedExtensions = /(\.jpg)$/i;
    if(!allowedExtensions.exec(place)) {
       // alert('Please upload Welcome Image jpg file only');
        Swal.fire({
            title: 'Wrong File Type',
            text: 'Please upload Welcome Image jpg file only',
            type: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK!'
        });
        return;  //get out now
    }
    else{
        let img = document.createElement("img");
        img.src = place;
        welcomePath = place;
        document.getElementById("Welcome").innerHTML = "Welcome Screen";
        document.getElementById("Welcome").appendChild(img);
        document.getElementById("Welcome").style.backgroundColor = 'white';
    }
}

//********************* Drop Show Folders Here  ******************************
function dropShowFiles(divid, fromFolder){
  // let showName = '\\phantom2'; // REMOVE ThIS LINE +++++++++++++++++++++++++++++++++%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    if((divid.substring((divid.length - 4)) !== 'Text')){   // make sure we are updating data to Text suffix div only
        divid = divid+ 'Text'
    }

    let divUpdate = document.getElementById(divid); // get the element before changing the divid to get the rood description
    let correctedCount = 0;
    divUpdate.innerText = "testing";
    console.log("folder dropped into: "+ divid + " and sent from: " + fromFolder);
    if((divid.substring((divid.length - 4)) === 'Text')){   // if the id ends with Text, get rid of it.
        divid = divid.substring(4, divid.length - 4); //get rid of show prefix too
    }
    else{
        divid = divid.substring(4 ); //get rid of show prefix
    }
   let newdir = (saveLocation + showName + '\\' + divid) ;  //.replace(/^.*(\\|\/|\:)/, '')); // get the correct save location for the files
   // let newdir = 'C:\\Users\\Steve.WIZ\\show\\steve\\English' //divid;
    fs.readdir(fromFolder, (err, files) => {
        console.log("There are this many files to copy: "+files.length);
      for (i =0; i< files.length; i++) {
          if(fs.lstatSync(fromFolder + "\\" + files[i]).isFile() ){

              console.log("copied file: " + files[i] );
              divUpdate.innerText = divid + "\n" +  (i)+ ' Files'  ;

              fs.copyFileSync(fromFolder + "\\" + files[i], newdir + "\\" + files[i], (error) => {      // <3>
                  if (error) {
                      console.log("error: " + error );
                  }
                  console.log("ok");
              });
          }
          else{
              correctedCount +=1;
          }
      }
      fs.readdir(newdir, (err, files) => {
          console.log("This many files have been copied: " + (files.length - correctedCount) + ' Skipped ' + correctedCount + ' directorie(s)');
          divUpdate.innerText = divid + "\n" +  (i +1)+ ' Files Copied \n' + files.length + ' Total' ;
      });

    });
}

//******************** SAVE BUTTON  ***************************
function saveButton() {
    console.log("save buton pressed");
    let result = document.getElementById("wizdat").elements;


    for (i=0 ; i<result.length; i++){ //get all text  and number box inputs
        if((result[i].type =="text") ||(result[i].type == "number") ) {
            wiz[result[i].name] = result[i].value;
        }
        else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
            wiz[result[i].name] = result[i].value;
        }
    }
    wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wiz.dat file

  //  let result1 = document.getElementById("services").elements;

  //  for (i=0 ; i<result1.length; i++) { //get all service inputs
  //      wiz["service"] = wiz["service"] || []; // initialize wiz.service
 //       if (result1[i].type == "text") {
 //           wiz["service"].push(result1[i].value);
 //       }
 //   }
    showName = '\\' + document.getElementById('ShowName').value;
    wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
    wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);
    if (fs.existsSync(saveLocation + showName)) { // show directory is already there
       Swal.fire({
           title: 'Show Already Exists',
           text: 'Please change show name',
           type: 'error',
           showCancelButton: false,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33',
           confirmButtonText: 'OK!'
       });
        return;  //get out now
    }
    else{
        if(welcomePath) {

            //create directory
            fs.mkdir(saveLocation + showName, function (err) {
                if (err) {
                    console.log('failed to create directory');
                    return console.error(err);
                } else {
                    console.log('Directory created successfully');
                }
                //  and write file
                fs.writeFile(saveLocation + showName + "\\wiz.dat", wizJsonString, (err) => {
                    if (err) {
                        console.log("error creating wiz.dat " + err)
                    }
                });
            });
        }

        else{
            Swal.fire({
                title: 'Welcome Image',
                text: 'Please add Welcome Image to show',
                type: 'error',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK!'
        })
            return;  //get out now
        }
    }

    fs.copyFile (welcomePath, saveLocation + showName + '/Welcome.jpg', err => { //copy welcome image to show directory
        if (err){
            console.error(err)
        }
      //  console.log('copied Welcome Image!')
    });

     for(i=0; i<service.length; i++){
         console.log('Service ' + i + ' = '+ service[i]);
         addShowDiv(service[i]);
         fs.mkdir(saveLocation + showName + '/' + service[i], function (err) { // add proper directory
             if (err) {
                 console.log('failed to create directory');
                 return console.error(err);
             } else {
                 console.log('Directory created successfully');
             }
         });
     }
    document.getElementById("wizdat").style.display = 'none';
    document.getElementById("buttons").style.display = 'none';
    document.getElementById("flexShow").style.display = 'flex';
    document.getElementById("flexShowText").style.display = 'block';
}

//**********************  Save DEFAULT Configuration  *************************
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
                if((result[i].type =="text") ||(result[i].type == "number") ) {
                    wiz[result[i].name] = result[i].value;
                }
                else if(result[i].type =="radio" && result[i].checked == true){ //get all radio button inputs
                    wiz[result[i].name] = result[i].value;
                }
            }
            wiz["Nothing"] = "SHOW  SETTINGS";// don't now why, but this is in current wizdat file
            wiz["ShowName"] =""; //no show name is default settings -- also no version number in default

            fs.unlink(saveLocation + "\\master_wiz.dat", (err) => {
                if (err) {
                    console.log("failed to delete file: "+err);
                } else {
                    console.log('successfully deleted local file');
                }
                wizJsonString =  JSON.stringify(wiz ).replace(/,/g, '\r\n').replace(/"/g,'');
                wizJsonString = wizJsonString.substr(1,wizJsonString.length -2);

                fs.writeFile(saveLocation + "\\master_wiz.dat", wizJsonString, (err) => {
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

//******************* add a new show button clicked *****************************
function addNewShow(){
    document.getElementById("startup").style.display = 'none';
    document.getElementById("flexShow").style.display = 'none';
    document.getElementById("flexShowText").style.display = 'none';
    document.getElementById("mainDiv").style.visibility='visible';

    document.getElementById("saveFileLocation").innerHTML = "This show will be saved in this location: " + saveLocation; //display to user the save show location
    // get info for Version
     let current_datetime = new Date();
     let formatted_date =   current_datetime.getFullYear()+appendLeadingZeroes(current_datetime.getMonth() + 1) + appendLeadingZeroes(current_datetime.getDate());
     readDatFile( saveLocation + "/master_wiz.dat"); // put default values in form
     document.getElementById("Version").value = formatted_date;// now put in updated version number

    //this is for testing only **********************************************
          //    addShowDiv('English','English','English');
          //    addShowDiv('French','French','French');
          //    addShowDiv('DScriptive','DScriptive','DScriptive');
         //     addShowDiv('I6-English','I6-English','I6-English');


}

 function editExistingShow(){
  // add code to fetch existing shows

  console.log("Existing show goes here");
}

async function addService() {

    const { value: serviceName } = await Swal.fire({
        title: 'Enter service',
        input: 'text',
        showCancelButton: true,
        type:'question',
        inputPlaceholder: 'Enter Service Name'
    });

    if (serviceName) {
     //   Swal.fire(`Entered Service: ` + serviceName)
        var br = document.createElement("br");
        var newService = document.createElement("Input");
        newService.setAttribute('name', "Service"+ count, );
        newService.setAttribute('readonly',true);
        newService.setAttribute('value',serviceName);
        var newServiceLabel=document.createElement("Label");
        newServiceLabel.innerText="Service" + count + " ";
        count ++;
        service.push(serviceName);
        document.getElementById("systemServidesDiv").appendChild(newServiceLabel);
        document.getElementById("systemServidesDiv").appendChild(newService);
        document.getElementById("systemServidesDiv").appendChild('&nbsp');
    }

}

//************************ Puts up a new div for each show folder ************************
function addShowDiv(divId ){
    let div = document.createElement('div');

    div.setAttribute('class', 'showFlex');
    div.id= divId;
    div.name= divId;
   // div.innerHTML  <p>divText</p>;

    //div.style.height="100px";
    document.getElementById("flexShow").appendChild(div);



    var img = document.createElement("img");
    img.class = "showFlex1";
    img.id= 'show'+ divId;
    img.src = "./public/Images/folder.png" ;
   // img.style.height="100%";
  //  img.style.marginRight="25px";
    img.setAttribute('class', 'showFlex1');
    img.name=divId;
    img.addEventListener("click", imageClick, false);
    var src = document.getElementById(divId);
    src.appendChild(img)
    let div1 = document.createElement('div');
    div1.id= 'show' + divId+ 'Text';
    div1.setAttribute('class', 'divText');
    div1.addEventListener("click", imageClick, false);
    div1.innerHTML = divId +  '<br/>' +  '0 Files';
    div1.name=divId;
    //div.style.height="100px";
    document.getElementById(divId).appendChild(div1);


}
//*************************  clicked file icon image to bring up opendialog  ******************************************
function imageClick(event){ //user has clicked on one of the show folders
    console.log(os.homedir());
    console.log("clicked: " + event.target.name);
    const remote = require("electron").remote;
    const dialog = remote.dialog;
    dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openDirectory" ]
    }).then(result => {
        if (result.canceled === false) {
            console.log("Selected file paths:");
            console.log(result.filePaths[0]);
            dropShowFiles('show'+ event.target.name+'Text', result.filePaths[0]);
        }
    }).catch(err => {
        console.log(err)
    })
}

//*************************  clicked WELCOME image to bring up opendialog  ******************************************
function welcomeClick(){
    console.log('clicked Welcome Image' );
    const remote = require("electron").remote;
    const dialog = remote.dialog;
    dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters:[{ name: 'JPG Files', extensions: ['jpg'] }],
        properties: ["openFile" ]
    }).then(result => {
        if (result.canceled === false) {
            console.log("Selected file paths:");
            console.log(result.filePaths[0]);
            dropWelcome(result.filePaths[0]);
        }
    }).catch(err => {
        console.log(err)
    })
}

function readDatFile(filename) { //read the wiz.dat file and populate teh screen parameters with it.
    let parameter;
    let value;

    try {
        // read contents of the file
        const data = fs.readFileSync(filename, 'UTF-8');
        // split the contents by new line
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            if (line.indexOf(':') != -1) { // make sure there is a :

                parameter=line.substr(0, line.indexOf(':'));
                value= line.substr(line.indexOf(':') + 1).trim();
                try{
                    if(parameter=='StartUp'){
                        if (value==1){
                            document.getElementById("manualStartup").checked = true;
                        }
                        else{
                            document.getElementById("autoStartup").checked = true;
                        }
                    }
                    else if(parameter=='I6_Orientation'){ // for radio buttons

                        if (value=='L'){
                            document.getElementById("I6_OrientationL").checked = true;
                        }
                        else{
                            document.getElementById("I6_OrientationR").checked = true;
                        }
                    }
                    else{
                        document.getElementById(parameter).value = value;
                    }
                }
                catch {
                   // console.log("error reading wiz.dat")
                }

            } else {
                console.log('Invalid line colon not found - ignoring:' + line);
            }

        });
    } catch (err) {
        console.error(err);
    }
}
