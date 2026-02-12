$(document).ready(function(){
 axios.get('http://localhost:3000/api/categories')
 .then(response=>{
     let categories = response.data
      for (let i = 0; i < categories.length; i++){
        $('#category').append(`<option value="${categories[i]}">${categories[i]}</option>`)
      }
       $('#category').append(`<option value="custom">+ Додати свою</option>`);
 })



})
$('#category').on('change', function() {
    if ($(this).val() === 'custom') {
        let newCategory = prompt('Введіть нову категорію:');
        if (newCategory) {
            $('#category').append(
                `<option value="${newCategory}" selected>${newCategory}</option>`
            );
        }
    }
});
$('.adminChoose').on('click', function() {
    $('.adminChoose').removeClass('active');
    $(this).addClass('active');
});




$('#create').click(() => {
     let data = {
         name: $('#name').val(),
         price: $('#price').val(),
         category: $('#category').val()
     };
     console.log(data);
     axios.post('http://localhost:3000/api/products', data)
       $('#name').val('')
       $('#price').val('')
       alert('було успішно додано')
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