document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;

    class Parameters {
        name: string;
        weight: number;
        minValue: number;
        midValue: number;
        id: string;

        constructor(name: string, weight: number, minValue: number, midValue: number, id: string) {
            this.name = name;
            this.weight = weight;
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
            itemText.textContent = `${this.name} - Weight: ${this.weight} kg`;
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
            infoButton.style.width = '45px'; // Set width to match other buttons
            const icon2 = document.createElement('box-icon');
            icon2.setAttribute('name', 'info-circle');
            icon2.setAttribute('size', 'sm');
            infoButton.appendChild(icon2);
            buttonGroup.appendChild(infoButton);

            const infoDiv = document.createElement('div');
            infoDiv.className = "d-none mt-3 p-3 bg-light rounded";
            infoDiv.textContent = `Min Value: ${this.minValue}, Mid Value: ${this.midValue}`;
            listItem.appendChild(infoDiv);

            listItem.appendChild(contentWrapper);
            listItem.setAttribute('data-id', this.id);
            itemList.appendChild(listItem);

            buttonPlus.addEventListener('click', () => {
                this.updateWeight(1);
                itemText.textContent = `${this.name} - Weight: ${this.weight} kg`;
                this.updateBackground(listItem);
            });

            buttonMinus.addEventListener('click', () => {
                this.updateWeight(-1);
                itemText.textContent = `${this.name} - Weight: ${this.weight} kg`;
                this.updateBackground(listItem);
            });

            deleteButton.addEventListener('click', () => {
                this.removeItem(listItem);
            });

            infoButton.addEventListener('click', () => {
                infoDiv.classList.toggle('d-none');
            });

            this.updateBackground(listItem);
        }

        updateWeight(change: number) {
            this.weight += change;
            localStorage.setItem(this.id, JSON.stringify(this));
        }

        updateBackground(listItem: HTMLLIElement) {
            listItem.classList.remove('bg-success', 'bg-warning', 'bg-danger');
            if (this.weight > this.midValue) {
                listItem.classList.add('bg-success');
            } else if (this.weight > this.minValue && this.weight <= this.midValue) {
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
                const { name, weight, minValue, midValue, id } = JSON.parse(itemData);
                if (itemData && id) {
                    console.log(`Loading item with id: ${id}`);
                    const item = new Parameters(name, weight, minValue, midValue, id);
                    item.addItem();
                }
            }
        });
    }

    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemName = (document.querySelector('#item-name') as HTMLInputElement).value;
        const itemWeight = parseFloat((document.querySelector('#item-weight') as HTMLInputElement).value);
        const itemMinWeight = parseFloat((document.querySelector('#item-minValue') as HTMLInputElement).value);
        const itemMiddWeight = parseFloat((document.querySelector('#item-midValue') as HTMLInputElement).value);

        if (isNaN(itemWeight) || isNaN(itemMinWeight) || isNaN(itemMiddWeight) || itemWeight < 0 || itemMinWeight < 0 || itemMiddWeight < 0) {
            errorMessage.textContent = 'Invalid input. Please enter positive numbers for weight and values.';
            return;
        } else if (itemWeight < itemMinWeight || itemMinWeight > itemMiddWeight || itemMiddWeight > itemWeight) {
            errorMessage.textContent = 'Invalid input. Please enter valid weight and values.';
            return;
        }

        const id = Date.now().toString();
        const item = new Parameters(itemName, itemWeight, itemMinWeight, itemMiddWeight, id);
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
