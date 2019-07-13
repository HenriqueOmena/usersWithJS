class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formCreateEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();
        Form.fill();
    }



    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener('submit', event => {
            event.preventDefault();

            let btn = this.formUpdateEl.querySelector('[type=submit]');

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(

                content => {

                    if (!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result)
                    tr.innerHTML =
                    `
                        <tr>
                            <td>
                                <img src="${result._photo}" alt="User Image" class="img-circle img-sm">
                            </td>
                            <td>${result._name}</td>
                            <td>${result._email}</td>
                            <td>${(result._admin) ? 'Sim' : 'Não' }</td>
                            <td>${Utils.dateFormat(result._register)}</td>
                            <td>
                                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                            </td>
                        </tr>
                    `;

                    this.addEventsTr(tr)

                    this.updateCount();

                    btn.disabled = false;

                    this.formUpdateEl.reset();

                    this.showPanelCreate();

                },
                (e) =>{

                    console.error(e);

                }
            );
        })
    }


    onSubmit(){

        this.formCreateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formCreateEl.querySelector('[type=submit]');

            btn.disabled = true;

            let values = this.getValues(this.formCreateEl);

            if(!values) return false;

            this.getPhoto(this.formCreateEl).then(

                content => {

                    values.photo = content;

                    this.addLine(values);

                    this.formCreateEl.reset();

                    btn.disabled = false;



                },
                (e) =>{

                    console.error(e);

                }
            );

            this.getPhoto((content) => {
                values.photo = content;
                this.addLine(values);
            });

        });

    }

    getPhoto(formEl){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            // para cada item do formulario retiro apenas o elemento que preciso no caso o  PHOTO

            console.log('FORM EL', Array.from(formEl.elements));
            let elements = [...Array.from(formEl).elements].filter( item => {

                if (item.name === 'photo') {
                    return item;
                }

            });

            //console.log('ELEMENTS', elements);
            let file = elements[0].files[0];
            console.log(file)
            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {

                reject(e);

            };

            if (file){

                fileReader.readAsDataURL(file);

            } else {

                resolve('../dist/img/boxed-bg.jpg');

            }


        });

    }

    getValues( formEl ){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach( (field, index) => {

            if (['name', 'email'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add('has-error');
                isValid = false;
            }


            if (field.name == "gender") {
                if (field.checked ) {
                    user[field.name] = field.value;
                }
                //console.log(field.value)
           }else if (field.name == "admin"){

                user[field.name] = field.checked;

           }
            else{

                user[field.name] = field.value

            }

        });

        if (!isValid){

            return false;

        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin,
        );

    }
    getUsersStorage() {
        let users = [];

        if (sessionStorage.getItem('users')) {
            users = JSON.parse(sessionStorage.getItem(('users')))
        }

        return users
    }

    selectAll() {
        let users = this.getUsersStorage();

        users.forEach( dataUser => {


            let user = new User();

            user.loadFromJSON(dataUser);

            this.addLine(dataUser)

        })

    }

    insert(data) {

        let users = this.getUsersStorage();
        users.push(data);

        sessionStorage.setItem("key", "value")

    }

    addLine(dataUser) {

        let tr = document.createElement('tr');
        //console.log(dataUser);

        this.insert(dataUser)

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML =
        `
            <tr>
                <td>
                    <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm">
                </td>
                <td>${dataUser.name}</td>
                <td class="text-primary">${dataUser.gender}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ? 'Sim' : 'Não' }</td>
                <td>${Utils.dateFormat(dataUser.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            </tr>
        `;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);
        this.updateCount();

    }

    addEventsTr(tr){
        const btnDelete = tr.querySelector('.btn-danger')

        if (btnDelete) {
            btnDelete.addEventListener('click', e => {
                if (confirm('Deseja realmente Excluir?')){
                    tr.remove();

                    this.updateCount();
                }
            });
        }

        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json){

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    switch (field.type) {
                        case 'file':
                        continue;

                        case 'radio':
                            // field = form.querySelector(
                            //     "[name=" + name.replace("_", "") + "][value=" +json[name] + "]"
                            // );
                            field.checked = true;
                        break;

                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                        }

                }

            }
            //console.log('teste', this.formUpdateEl.querySelector(".photo").src = json._photo);
            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();

        });
    }

    showPanelCreate(){

        document.querySelector('#box-user-update').style.display = 'block';
        document.querySelector('#box-user-create').style.display = 'none';

    }

    showPanelUpdate(){

        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';

    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;


        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;

    }

}

class Form {
    static fill(formSelector = '#form-user-create .form-group' ){
        let boxInputs = document.querySelectorAll(formSelector)

        boxInputs.forEach( el => {
            let field = el.querySelector("[name]");

            //console.log(field.type);
            switch (field.type) {
                // case 'file':
                //     case 'file':
                //     break;
                case 'text':
                    field.value = 'Henrique Omena';
                    break;
                case 'date':
                    field.value = new Date('1988-02-02').toISOString().substring(0, 10)
                    break;
                case 'select-one':
                    field.value = 'Brazil';
                    break;
                case 'email':
                    field.value = 'henrique.omena@acin.pt';
                    break;
                case 'password':
                    field.value = '12345';
                    break;
                case 'file':
                    field.photo = 'dist/img/boxed-bg.jpg';
                    break;
                case 'radio':
                    break;
                case 'checkbox':
                    field.checked = true;
                break;

            }
        })
    }
}
