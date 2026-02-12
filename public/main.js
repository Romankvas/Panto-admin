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
       <div class="confirm"> <button class="edit" id="${el._id}">edit</button> <button class="delete" id="${el._id}">delete</button></div>
       </div>
       `)
       
   }
})
$(document).on("click", ".delete", function() {

    if (confirm('Ви впевнені, що хочете видалити товар?')) {

        axios.delete(`http://localhost:3000/api/products/${this.id}`)
        .then(() => {
            $(this).closest('.product').remove(); 
        })
        .catch(err => console.log(err));

    }
});