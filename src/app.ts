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
    constructor(name: string, weight: number, minValue: number, midValue: number, id: string){
        this.name = name;
        this.weight = weight;
        this.minValue = minValue;
        this.midValue = midValue;
        this.id = id;
    }
    addItem() {
        const listItem = document.createElement('li');
        listItem.className = 'relative mb-8 max-w-md mx-auto p-4 bg-green-400 list-none rounded shadow-md border border-gray-300 transform'
        
        const contentWrapper = document.createElement('div');
        const itemText = document.createElement('span')
        itemText.className ='mr-4'
        itemText.textContent =  `${this.name} - Weight: ${this.weight} kg`
        contentWrapper.appendChild(itemText);
        
        const buttonMinus = document.createElement('button');
        buttonMinus.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l'
        buttonMinus.textContent = '-';
        contentWrapper.appendChild(buttonMinus);
        
        const buttonPlus = document.createElement('button');
        buttonPlus.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r'
        buttonPlus.textContent = '+';
        contentWrapper.appendChild(buttonPlus);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = ' bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 ml-24  rounded';
        const icon = document.createElement('box-icon');
        icon.setAttribute('name', 'trash');
        deleteButton.appendChild(icon);
        contentWrapper.appendChild(deleteButton);

        const infoButton = document.createElement('button')
        infoButton.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 h-full rounded-r-full shadow-lg absolute -right-12 top-0 bottom-0 flex items-center justify-center"
        const icon2 = document.createElement('box-icon')
        icon2.setAttribute('name', 'info-circle')
        infoButton.appendChild(icon2)
        contentWrapper.appendChild(infoButton);

        const infoDiv = document.createElement('div')
        infoDiv.className = "hidden mt-2 p-2 bg-gray-200 rounded"
        infoDiv.textContent = `Min Value: ${this.minValue}, Mid Value: ${this.midValue}`
        listItem.appendChild(infoDiv)
        
        
        listItem.appendChild(contentWrapper);
        listItem.setAttribute('data-id', this.id);
        itemList.appendChild(listItem);

        buttonPlus.addEventListener('click', ()=> {
            this.updateWeight(1)
            itemText.textContent = `${this.name} - Weight: ${this.weight} kg`
            this.updateBackground(listItem)
        })

        buttonMinus.addEventListener('click', ()=> {
            this.updateWeight(-1)
            itemText.textContent = `${this.name} - Weight: ${this.weight} kg`
            this.updateBackground(listItem)
        })

        deleteButton.addEventListener('click', ()=> {
            this.removeItem(listItem)
        })

        infoButton.addEventListener('click', ()=>{
            infoDiv.classList.toggle('hidden');
        })
        this.updateBackground(listItem);
    }
    
    
    
    
    updateWeight(change:number){
        this.weight += change
        localStorage.setItem(this.id, JSON.stringify(this))
    }
    updateBackground(listItem:HTMLLIElement){
        if (this.weight > this.midValue) {
            listItem.classList.remove('bg-yellow-300');
            listItem.classList.add('bg-green-400');
        } else if (this.weight > this.minValue && this.weight <= this.midValue) {
            listItem.classList.remove('bg-green-400');
            listItem.classList.add('bg-yellow-300');
        } else {
            listItem.classList.remove('bg-yellow-300', 'bg-green-400');
            listItem.classList.add('bg-red-400');
        }
    }

    removeItem(listItem:HTMLLIElement){
        localStorage.removeItem(this.id);
        listItem.remove()
    }




}

function loadItems() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        const itemData = localStorage.getItem(key);
        if (itemData) {
            const { name, weight, minValue, midValue, id } = JSON.parse(itemData);
            if (itemData && id) {
                console.log(`Loading item with id: ${id}`);  // Debug log
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