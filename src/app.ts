document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

    class Parameters {
        name: string;
        amount: number;
        minValue: number;
        midValue: number;
        id: string;

        constructor(name: string, amount: number, minValue: number, midValue: number, id: string) {
            this.name = name;
            this.amount = amount;
            this.minValue = minValue;
            this.midValue = midValue;
            this.id = id;
        }

        addItem() {
            const listItem = document.createElement('li');
            listItem.className = 'd-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mb-5 p-4 bg-success rounded-lg shadow-lg border';

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'd-flex flex-column flex-grow-1';

            const itemText = document.createElement('span');
            itemText.className = 'mb-3 mb-md-0 text-truncate';
            itemText.style.maxWidth = '100%';
            itemText.textContent = `${this.name} - Amount: ${this.amount}`;
            contentWrapper.appendChild(itemText);

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'd-flex mt-3 mt-md-0 ms-auto';
            contentWrapper.appendChild(buttonGroup);

            const buttonStyle = 'btn btn-secondary btn-sm';
            const actionButtonStyle = 'btn btn-danger ms-2 ms-md-3 btn-sm d-flex align-items-center justify-content-center';

            const buttonMinus = document.createElement('button');
            buttonMinus.className = buttonStyle;
            buttonMinus.style.width = '45px';
            buttonMinus.textContent = '-';
            buttonGroup.appendChild(buttonMinus);

            const buttonPlus = document.createElement('button');
            buttonPlus.className = buttonStyle;
            buttonPlus.style.width = '45px';
            buttonPlus.textContent = '+';
            buttonGroup.appendChild(buttonPlus);

            const deleteButton = document.createElement('button');
            deleteButton.className = actionButtonStyle;
            const icon = document.createElement('box-icon');
            icon.setAttribute('name', 'trash');
            icon.setAttribute('size', 'sm');
            deleteButton.appendChild(icon);
            buttonGroup.appendChild(deleteButton);

            const infoButton = document.createElement('button');
            infoButton.className = 'btn btn-primary ms-2 ms-md-3 btn-sm d-flex align-items-center justify-content-center';
            infoButton.style.width = '45px'; 
            const icon2 = document.createElement('box-icon');
            icon2.setAttribute('name', 'info-circle');
            icon2.setAttribute('size', 'sm');
            infoButton.appendChild(icon2);
            buttonGroup.appendChild(infoButton);

            const infoDiv = document.createElement('div');
            infoDiv.className = "d-none mt-3 p-3 bg-light rounded";
            infoDiv.textContent = `Min Amount: ${this.minValue}, Mid Amount: ${this.midValue}`;
            listItem.appendChild(infoDiv);

            listItem.appendChild(contentWrapper);
            listItem.setAttribute('data-id', this.id);
            itemList.appendChild(listItem);

            buttonPlus.addEventListener('click', () => {
                this.updateAmount(1);
              
                itemText.textContent = `${this.name} - Amount: ${this.amount}`;
                this.updateBackground(listItem);
            
            });

            buttonMinus.addEventListener('click', () => {
                
            if(this.amount > 0){
                this.updateAmount(-1);
                itemText.textContent = `${this.name} - Amount: ${this.amount} `;
                this.updateBackground(listItem);}
            else {
                return; 
            }
            });

            deleteButton.addEventListener('click', () => {
                this.removeItem(listItem);
            });

            infoButton.addEventListener('click', () => {
                infoDiv.classList.toggle('d-none');
            });

            this.updateBackground(listItem);
        }

        updateAmount(change: number) {
            this.amount += change;
            localStorage.setItem(this.id, JSON.stringify(this));
        }

        updateBackground(listItem: HTMLLIElement) {
            listItem.classList.remove('bg-success', 'bg-warning', 'bg-danger');
            if (this.amount > this.midValue) {
                listItem.classList.add('bg-success');
            } else if (this.amount > this.minValue && this.amount <= this.midValue) {
                listItem.classList.add('bg-warning');
            } else {
                listItem.classList.add('bg-danger');
            }
        }

        removeItem(listItem: HTMLLIElement) {
            localStorage.removeItem(this.id);
            listItem.remove();
        }
    }

    function loadItems() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            const itemData = localStorage.getItem(key);
            if (itemData) {
                const { name, amount, minValue, midValue, id } = JSON.parse(itemData);
                if (itemData && id) {
                    console.log(`Loading item with id: ${id}`);
                    const item = new Parameters(name, amount, minValue, midValue, id);
                    item.addItem();
                }
            }
        });
    }

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = (document.querySelector('#item-name') as HTMLInputElement).value;
        const itemAmount = parseFloat((document.querySelector('#item-weight') as HTMLInputElement).value);
        const itemMinAmount = parseFloat((document.querySelector('#item-minValue') as HTMLInputElement).value);
        const itemMidAmount = parseFloat((document.querySelector('#item-midValue') as HTMLInputElement).value);

        if (isNaN(itemAmount) || isNaN(itemMinAmount) || isNaN(itemMidAmount) || itemAmount < 0 || itemMinAmount < 0 || itemMidAmount < 0) {
            errorMessage.textContent = 'Invalid input. Please enter positive numbers for Amount and values.';
            return;
        } else if (itemAmount < itemMinAmount || itemMinAmount > itemMidAmount || itemMidAmount > itemAmount) {
            errorMessage.textContent = 'Invalid input. Please enter valid Amount and values.';
            return;
        }

        const id = Date.now().toString();
        const item = new Parameters(itemName, itemAmount, itemMinAmount, itemMidAmount, id);
        item.addItem();
        localStorage.setItem(item.id, JSON.stringify(item));

        errorMessage.textContent = "";
        (document.querySelector('#item-name') as HTMLInputElement).value = '';
        (document.querySelector('#item-weight') as HTMLInputElement).value = '';
        (document.querySelector('#item-minValue') as HTMLInputElement).value = '';
        (document.querySelector('#item-midValue') as HTMLInputElement).value = '';
    });

    loadItems();
});
