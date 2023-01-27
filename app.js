const name = document.getElementById('name');
const surName = document.getElementById('surName');
const mail = document.getElementById('mail');
const form = document.getElementById('form-contact');
const contactList = document.querySelector('.contact-list');


//event listener
form.addEventListener('submit', submit);
contactList.addEventListener('click',doContactEvent);

//list for all contacts to add local storage
const allContactsArray = [ ];
let chosenLine = undefined;

function doContactEvent(event){
    if(event.target.classList.contains('btn--delete')){
        const deletedTrElement = event.target.parentElement.parentElement;
        const deletedMail = event.target.parentElement.previousElementSibling.textContent;
        deleteContact(deletedTrElement, deletedMail);
        console.log(event.target.parentElement.parentElement);
    }
    else if(event.target.classList.contains('btn--edit')){
        document.querySelector('.saveEdit').value = "Edit";
        const chosenTr = event.target.parentElement.parentElement;
        const updatedMail = chosenTr.cells[2].textContent;

        name.value = chosenTr.cells[0].textContent;
        surName.value = chosenTr.cells[1].textContent;
        mail.value = chosenTr.cells[2].textContent;

        chosenLine = chosenTr;
    }
}

function deleteContact(deletedTrElement, deletedMail){
    deletedTrElement.remove();

    //maile gore silme
    allContactsArray.forEach((contact, index) => {
        if(contact.mail === deletedMail){
            allContactsArray.splice(index,1);
        }
    })
    removeSpaces();
    document.querySelector('saveEdit') = "Submit";
}

function submit(e){
    e.preventDefault();
    const contactToAdd ={
        name: name.value,
        surName: surName.value,
        mail: mail.value
    }
    const result = chectData(contactToAdd);
    if(result.state){
        if(chosenLine){
            //do edit
            updateContact(contactToAdd);
        }
        else{
            addContact(contactToAdd);
        }
    }
    else{
        createInformation(result.message, result.state);
         
    }

    console.log(contactToAdd);
}

function chectData(contact){
    for(const value in contact){
        if(contact[value]){
            console.log(contact[value]);
        }
        else{
            const result= {
                state: false,
                message: 'You have to fill all of the blanks'
            }
            return  result;
        }
        
    }
    removeSpaces();
    return {
        state: true,
        message: 'Saved Succesfully'
    }
}

function createInformation(message, state){
    const createdInfo = document.createElement('div');
    createdInfo.textContent = message;
    createdInfo.className = 'info';

    createdInfo.classList.add(state ? 'info--success' : 'info--error')
    document.querySelector('.container').insertBefore(createdInfo, form);

    setTimeout(function(){
        const deletedDiv = document.querySelector('.info');
        if(deletedDiv){
            deletedDiv.remove();
        }
    },2000);
}

function removeSpaces(){
    name.value= '';
    surName.value = '';
    mail.value = '';
}

function addContact(contactToAdd){
    const createdTrElement = document.createElement('tr');
    createdTrElement.innerHTML = `<td>${contactToAdd.name}</td>
    <td>${contactToAdd.surName}</td>
    <td>${contactToAdd.mail}</td>
    <td>
        <button class="btn btn--edit">
            <i class="far fa-edit"></i>
        </button>
        <button class="btn btn--delete">
            <i class="far fa-trash-alt"></i>
        </button>
    </td>`;
    contactList.appendChild(createdTrElement);
    allContactsArray.push(contactToAdd);
    createInformation('Created Succesfully', true);
    
}

function updateContact(contact){

    for(let i=0; i<allContactsArray.length; i++){
        if(allContactsArray[i].mail === chosenLine.cells[2]){
            allContactsArray[i] = contact;
            break;
        }
    }

    chosenLine.cells[0].textContent = contact.name;
    chosenLine.cells[1].textContent = contact.surName;
    chosenLine.cells[2].textContent = contact.mail;
    document.querySelector('.saveEdit').value = "Submit";
    chosenLine = undefined;
}

