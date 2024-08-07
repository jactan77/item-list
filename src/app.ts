document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById('item-form') as HTMLFormElement;
    const itemList = document.getElementById('item-list') as HTMLUListElement;
    const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;




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
    const myObj = {"name":item.name, "weight":item.weight, "minValue":item.minValue, "midValue":item.midValue}
    const myJSON = JSON.stringify(myObj);
    localStorage.setItem("testJSON", myJSON);
        
    document.querySelectorAll('li').forEach(element =>{
    element.addEventListener('click', () => {
         item.weight = prompt("Enter a new value for weight")
         if(item.weight < 0 || item.weight == ""  || item.weight == null || isNaN(item.weight)){
             errorMessage.textContent = 'Invalid input. Please enter a positive number for weight.'
             return;
            }
            let text = localStorage.getItem("testJSON");
            let obj = JSON.parse(text);
            item.weight = parseFloat(item.weight);
         element.textContent = `${item.name} - Weight: ${item.weight} kg ${obj.minValue}`;

    })
 
})
   
    errorMessage.textContent = ""
    itemName.value = '';
    itemWeight.value = '';
    itemMinWeight.value = '';
    itemMiddWeight.value = '';
    return item.minValue , item.midValue
    


})

const Parameters = function (name:string, weight:number, minValue:number, midValue:number) {
    this.name = name;
    this.weight = weight;
    this.minValue = minValue;
    this.midValue = midValue;
    this.addItem = function(itemList) {
        const listItem = document.createElement('li');
        listItem.classList.add('mb-8', 'max-w-md', 'mx-auto', 'p-4', 'bg-green-400', 'rounded', 'shadow-md', 'border', 'border-gray-300', 'transform', 'transition-transform', 'duration-200', 'hover:scale-105');
        listItem.textContent = `${this.name} - Weight: ${this.weight} kg`;
        itemList.appendChild(listItem);
    }
    
}











})