class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formCreateEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.fillForm();

    }

    fillForm(){
        let boxInputs = document.querySelectorAll('#form-user-create .form-group')
        console.log('boxInputs:', boxInputs)
        boxInputs.forEach( el => {
            let field = el.querySelector("[name]");

            console.log(field.type);
            switch (field.type) {
                // case 'file':
                //     case 'file':
                //     break;
                case 'text':
                    field.value = 'Henrique Omena';
                    break;
                case 'date':
                    //field.value = '1988-02-02';
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
                // case 'radio':
                //     break;
                case 'checkbox':
                    field.checked = true;
                break;

            }
        })
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
            console.log('values edit:', values)

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user)

            let result = Object.assign({}, userOld, values);

            if (!values.photo) result._photo = userOld._photo

            tr.dataset.user = JSON.stringify(result);

            tr.innerHTML =
            `
                <tr>
                    <td>
                        <img src="../${result._photo}" alt="User Image" class="img-circle img-sm">
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

              console.log('antes do update');
              this.updateCount();
              console.log('deu update do count');
              btn.disabled = true;

              this.formUpdateEl.reset();

              this.showPanelCreate();
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

                    //this.formCreateEl.reset();

                    btn.disabled = false;



                },
                (e) =>{

                    console.error(e);

                }
            );

            this.getPhoto((content) => {
                console.log('entro no getphoto');
                values.photo = content;
                this.addLine(values);
                console.log(content);
            });

        });

    }

    getPhoto(formEl){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter( item => {


                if (item.name === 'photo') {
                    return item;
                }

            });

            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);

            };

            fileReader.onerror = (e) => {

                reject(e);

            };

            if (file){

                fileReader.readAsDataURL(file);

            } else {

                resolve('dist/img/boxed-bg.jpg');

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


    addLine(dataUser) {

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML =
        `
            <tr>
                <td>
                    <img src="../${dataUser.photo}" alt="User Image" class="img-circle img-sm">
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
        tr.querySelector('.btn-edit').addEventListener('click', e => {
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
            console.log(json['_gender'])
            for (let name in json){

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");
                console.log(json)
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
