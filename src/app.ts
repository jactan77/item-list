document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;


    const Parameters = function (name: string, weight: number, minValue: number, midValue: number) {
        this.name = name;
        this.weight = weight;
        this.minValue = minValue;
        this.midValue = midValue;

        this.addItem = () => {
            const listItem = document.createElement('li');
            listItem.className = 'mb-8 max-w-md mx-auto p-4 bg-green-400 list-none rounded shadow-md border border-gray-300 transform transition-transform duration-200 hover:scale-105';
            
            const contentWrapper = document.createElement('div');
            const itemText = document.createElement('span')
            itemText.className = 'mr-4'
            
            
            itemText.textContent = `${this.name} - Weight: ${this.weight} kg`;
            contentWrapper.appendChild(itemText);
            
            const buttonMinus = document.createElement('button');
            buttonMinus.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l'
            buttonMinus.textContent = '-';
            contentWrapper.appendChild(buttonMinus);
            
            const buttonPlus = document.createElement('button');
            buttonPlus.className = 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r'
            buttonPlus.textContent = '+';
            contentWrapper.appendChild(buttonPlus);
            
            listItem.appendChild(contentWrapper);
            listItem.setAttribute('data-id', Date.now().toString());
            itemList.appendChild(listItem);
            
            

            buttonPlus.addEventListener('click', ()=>{
                    const itemId = listItem.getAttribute('data-id')
                    let text = localStorage.getItem(itemId);
                    let obj = JSON.parse(text);
                    obj.weight += 1;
                    localStorage.setItem(itemId, JSON.stringify(obj));
                    itemText.textContent = `${obj.name} - Weight: ${obj.weight} kg`
                    
                    if(obj.weight > obj.midValue) {
                        listItem.classList.remove('bg-yellow-300');
                        listItem.classList.add('bg-green-400');
                    } else if(obj.weight > obj.minValue  && obj.weight <= obj.midValue){
                        listItem.classList.remove('bg-green-400');
                        listItem.classList.add('bg-yellow-300');
                    } else {
                        listItem.classList.remove('bg-yellow-300', 'bg-green-400');
                        listItem.classList.add('bg-red-400');
                    }
            }
            
        )
        buttonMinus.addEventListener('click', ()=>{
            const itemId = listItem.getAttribute('data-id')
            let text = localStorage.getItem(itemId);
            let obj = JSON.parse(text);
            obj.weight -= 1;
            localStorage.setItem(itemId, JSON.stringify(obj));
            itemText.textContent = `${obj.name} - Weight: ${obj.weight} kg`
            
            if(obj.weight > obj.midValue) {
                listItem.classList.remove('bg-yellow-300');
                listItem.classList.add('bg-green-400');
            } else if(obj.weight > obj.minValue  && obj.weight <= obj.midValue){
                listItem.classList.remove('bg-green-400');
                listItem.classList.add('bg-yellow-300');
            } else {
                listItem.classList.remove('bg-yellow-300', 'bg-green-400');
                listItem.classList.add('bg-red-400');
            }
    }
    
)
        
        
        
        }
    }
        
        
itemForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    const itemName:HTMLInputElement = document.querySelector('#item-name'); 
    const itemWeight:HTMLInputElement = document.querySelector('#item-weight');
    const itemMinWeight:HTMLInputElement = document.querySelector('#item-minValue');
    const itemMiddWeight:HTMLInputElement = document.querySelector('#item-midValue')
    
    const item = new Parameters(itemName.value, parseFloat(itemWeight.value), parseFloat(itemMinWeight.value), parseFloat(itemMiddWeight.value));
    if (isNaN(item.weight) || isNaN(item.minValue) || isNaN(item.midValue) || item.weight < 0 || item.minValue < 0 || item.midValue < 0) {
        errorMessage.textContent = 'Invalid input. Please enter a positive number for weight and minimum value.';
        return;
    } else if(item.weight < item.minValue || item.minValue > item.midValue || item.midValue > item.weight) {
        errorMessage.textContent = 'Invalid input. Please enter a positive number for weight, minimum value.'
        return;
    } 
    item.addItem();
    const itemId = Date.now().toString();
    localStorage.setItem(itemId, JSON.stringify(item));
    
    
   
    errorMessage.textContent = ""
    itemName.value = '';
    itemWeight.value = '';
    itemMinWeight.value = '';
    itemMiddWeight.value = '';
    return item.minValue , item.midValue
    


})












})