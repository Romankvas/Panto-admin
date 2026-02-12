 $('#create').click(() => {
     let data = {
         name: $('#name').val(),
         price: $('#price').val(),
         category: $('#category').val()
     };
     console.log(data);
     axios.post('http://localhost:3000/api/products', data)
         .then(res => {
             console.log(res.data)
         })
         .catch(err => console.error(err));
 })


 axios.get('http://localhost:3000/api/products')
.then(res => {
   for(let el of res.data){
       $('.redactContainer').append(`
       <div class="product">
       <div class="productImage"></div>
       <p>${el.name}</p>
       <p>${el.price}</p>
       <p>${el.category}</p>
       <div class="confrim"> <button class="edit" id="${el.id}">edit</button></div>
       </div>
       `)
   }
})