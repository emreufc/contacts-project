class Contact{
    constructor(name, surName, mail){
        this.name = name;
        this.surName = surName;
        this.mail = mail;
    }
}
class Util{
    static checkEmptySpace(...spaces){
        let result = true;
        spaces.forEach(space => {
            
            if(space.length === 0){
                console.log("burda");
                result = false;
                return false;
            }
        });
        return result;
    }
    static emailCheck(mail){
            const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return re.test(String(mail).toLowerCase());
    }
}
class Screen{
    constructor(){
        this.name = document.getElementById('name');
        this.surName = document.getElementById('surName');
        this.mail = document.getElementById('mail');
        this.saveEditButton = document.querySelector('.saveEdit');
        this.form = document.getElementById('form-contact');
        this.form.addEventListener('submit', this.saveEdit.bind(this));
        this.contactList = document.querySelector('.contact-list');
        this.contactList.addEventListener('click', this.editOrRemove.bind(this));
        this.storage = new Storage();
        this.chosenLine = undefined; 
        this.writeContactsToTheScreen();
    }

    cleanSpaces(){
        this.name.value = '';
        this.surName.value = '';
        this.mail.value = '';
    }
    editOrRemove(e){
        const targetSpot = e.target;
        if(targetSpot.classList.contains('btn--delete')){
            this.chosenLine = targetSpot.parentElement.parentElement;
            this.removeContactFromScreen();
        }
        else if(targetSpot.classList.contains('btn--edit')){
            this.chosenLine = targetSpot.parentElement.parentElement;
            this.saveEditButton.value = 'Edit';
            this.name.value = this.chosenLine.cells[0].textContent;
            this.surName.value = this.chosenLine.cells[1].textContent;
            this.mail.value = this.chosenLine.cells[2].textContent; 


        }
    }
    editContactOnTheScreen(contact){

        const result = this.storage.editContact(contact, this.chosenLine.cells[2].textContent);
        if(result){
            this.chosenLine.cells[0].textContent = contact.name;
            this.chosenLine.cells[1].textContent = contact.surName;
            this.chosenLine.cells[2].textContent = contact.mail;
            
            this.cleanSpaces();
            this.chosenLine = undefined;
            this.saveEditButton.value = 'Submit';
            this.createInformation('Succesfully Edited', true);
        }
        else{
            this.createInformation('This email address already exist', false);
        }
        
    }
    removeContactFromScreen(){
        this.chosenLine.remove();
        const removedMail = this.chosenLine.cells[2].textContent;
        this.storage.removeContact(removedMail);
        this.cleanSpaces();
        this.chosenLine = undefined;
        this.createInformation('Succesfully Removed', true);
        
    }
    writeContactsToTheScreen(){
        this.storage.allContacts.forEach(contact=>{
            this.addContactToTheScreen(contact);
        });
    }
    addContactToTheScreen(contact){
        const createdTr = document.createElement('tr');
        createdTr.innerHTML = `<td>${contact.name}</td>
        <td>${contact.surName}</td>
        <td>${contact.mail}</td>
        <td>
        <button class="btn btn--edit">
            <i class="far fa-edit"></i>
        </button>
        <button class="btn btn--delete">
            <i class="far fa-trash-alt"></i>
        </button>
         </td>`;
        this.contactList.appendChild(createdTr);
        
    }

    createInformation(message, state){

        const infoDiv = document.querySelector('.info');

        infoDiv.innerHTML = message;
    
        infoDiv.classList.add(state ? 'info--success' : 'info--error')
        
        setTimeout(function(){
            infoDiv.className = 'info'
        },2000);
    }
    saveEdit(e){
        e.preventDefault();
        const contact = new Contact(this.name.value, this.surName.value, this.mail.value);
        const result = Util.checkEmptySpace(contact.name, contact.surName, contact.mail);
        const emailCheck = Util.emailCheck(this.mail.value);
        
        if(result){
            if(!emailCheck){
                this.createInformation('Please enter a valid email address.', false);
                return;
            }
            if(this.chosenLine){
                this.editContactOnTheScreen(contact);
            }
            else{
                const result = this.storage.addContact(contact);
                if(result){
                    this.createInformation("Succesfully Added", true);
                    this.addContactToTheScreen(contact);
                    this.cleanSpaces();
                }
                else{
                    this.createInformation('This email address already exist.', false);

                }
                
            }

            
        }
        else{
            this.createInformation('Please fill in the blanks.', false);
        }
    }
}
class Storage{
    constructor(){
        this.allContacts = this.getContacts();
    }
    isEmailUnique(mail){
        const result = this.allContacts.find(contact=>{
            return contact.mail === mail;
        });
        if(result){
            return false;
        }
        else {
            return true;
        }
    }
    getContacts(){
        let allContactsLocal;
        if(localStorage.getItem('allContacts') === null){
            allContactsLocal = [];
        }
        else{
            allContactsLocal = JSON.parse(localStorage.getItem('allContacts'));
        }
        return allContactsLocal;
    }
    addContact(contact){
        if(this.isEmailUnique(contact.mail)){
            this.allContacts.push(contact);
            localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
            return true;
        }
        else{
            return false;
        }
        
       
    }
    removeContact(mail){
        this.allContacts.forEach((contact, index) =>{
            if(contact.mail === mail){
                this.allContacts.splice(index, 1);
            }
        });
        localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
    }
    editContact(editedContact, mail){
        if(editedContact.mail === mail){
            this.allContacts.forEach((contact,index) =>{
                if(contact.mail === mail){
                    this.allContacts[index] = editedContact;
                }
            });
            localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
            return true;
        }
        if(this.isEmailUnique(editedContact.mail)){
            this.allContacts.forEach((contact,index) =>{
                if(contact.mail === mail){
                    this.allContacts[index] = editedContact;
                }
            });
            localStorage.setItem('allContacts', JSON.stringify(this.allContacts));
            return true;
        }
        else{
            return false;
        }
        return true;
        
    }
}

document.addEventListener('DOMContentLoaded', function(e){
    const screen = new Screen();
})